const WAREHOUSE_PATH='/data/eci_assembly_2022_warehouse_step89.json';
const readLocal=async request=>{
  const u=new URL(WAREHOUSE_PATH,request.url);
  const r=await fetch(u.toString(),{headers:{'cache-control':'no-cache'}});
  if(!r.ok) throw new Error(`warehouse HTTP ${r.status}`);
  return r.json();
};
const summary=w=>({state:w.coverage.state,election_year:w.coverage.election_year,election_type:'Assembly',expected_ac:w.coverage.assembly_constituencies_expected,loaded_ac:w.coverage.assembly_constituencies_loaded,complete:w.coverage.complete,source_layer:'local canonical normalized warehouse'});

export async function onRequestGet({request}){
  const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store',};
  try{
    const w=await readLocal(request); const u=new URL(request.url); const acRaw=u.searchParams.get('ac'); const mode=u.searchParams.get('mode')||'local';
    if(acRaw){
      const ac=Number(acRaw); const record=w.records.find(x=>x.ac_no===ac);
      if(!record) return new Response(JSON.stringify({error:'ac_not_found',ac}),{status:404,headers});
      let live=null;
      if(mode==='hybrid' || mode==='live'){
        try{
          const parser=new URL('/api/eci-result-parser',request.url); parser.searchParams.set('ac',String(ac));
          const r=await fetch(parser.toString(),{headers:{'user-agent':'VANDIRA-UP-2027/STEP89-Warehouse'}}); live=await r.json();
        }catch(e){live={ok:false,error:String(e.message||e)}}
      }
      return new Response(JSON.stringify({step:'STEP89',mode,record,live,source_policy:'Local warehouse is immutable; live ECI candidate evidence is additive and never overwrites the normalized record.'}),{headers});
    }
    const fields=u.searchParams.get('summary')==='1' ? null : w.records;
    return new Response(JSON.stringify({step:'STEP89',summary:summary(w),records:fields,record_count:w.records.length,source_policy:'Read-only normalized warehouse; AC number is the primary entity key.'}),{headers});
  }catch(e){return new Response(JSON.stringify({error:'warehouse_unavailable',message:String(e.message||e)}),{status:500,headers});}
}
