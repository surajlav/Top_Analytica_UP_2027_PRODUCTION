const LOCAL_FILES = {
  '2022': [
    '/data/historical_assembly_2012_2017.json',
    '/data/form20_candidate_map_2022.json',
    '/data/form20_booth_intelligence_manifest_2022.json',
    '/data/form20_data_quality_audit_2022.json',
    '/data/form20_integration_audit_2022.json'
  ],
  '2024-ls': [
    '/data/lok_sabha_2024_assembly_segment_results.json',
    '/data/lok_sabha_2024_party_summary.json'
  ]
};
const safe=s=>String(s||'').slice(0,1000);
async function readJson(request,path){
  try{const u=new URL(path,request.url); const r=await fetch(u.toString(),{headers:{'cache-control':'no-cache'}}); if(!r.ok)return {path,status:r.status,error:'HTTP '+r.status}; const data=await r.json(); return {path,status:r.status,data};}
  catch(e){return {path,status:0,error:String(e.message||e)}}
}
function summarize(data){
  if(!data||typeof data!=='object')return {type:typeof data};
  if(Array.isArray(data))return {type:'array',records:data.length,keys:data[0]&&typeof data[0]==='object'?Object.keys(data[0]).slice(0,30):[]};
  return {type:'object',keys:Object.keys(data).slice(0,40)};
}
export async function onRequestGet({request}){
  const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store',};
  const u=new URL(request.url); const dataset=u.searchParams.get('dataset')||'2022';
  if(!LOCAL_FILES[dataset])return new Response(JSON.stringify({error:'unknown_dataset',datasets:Object.keys(LOCAL_FILES)}),{status:400,headers});
  const results=[];
  for(const path of LOCAL_FILES[dataset]){const x=await readJson(request,path); results.push({...x,summary:summarize(x.data),data:x.data});}
  const ok=results.filter(x=>x.status===200).length;
  return new Response(JSON.stringify({step:'STEP88',dataset,read_only:true,immutable:true,file_count:results.length,ok_count:ok,results,source_policy:'Local canonical/derived datasets are read-only. External official ingestion is exposed separately at /api/eci-ingest.'}),{headers});
}
