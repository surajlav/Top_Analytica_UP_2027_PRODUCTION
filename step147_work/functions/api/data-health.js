const CHECKS = [
  'data/assembly_canonical_master.json',
  'data/assembly_2022_master.json',
  'data/historical_assembly_2012_2017.json',
  'data/lok_sabha_2024_assembly_segment_results.json',
  'data/form20_booth_intelligence_manifest_2022.json',
  'data/vandira_ai_data_contract_step85.json',
  'data/vandira_source_registry_step85.json',
  'data/vandira_ingestion_plan_step85.json'
];
export async function onRequestGet({env,request}){
  const base=new URL(request.url).origin;
  const results=[];
  for(const path of CHECKS){
    try{const r=await fetch(`${base}/${path}`,{cache:'no-store'}); results.push({path,status:r.status,ok:r.ok});}
    catch(e){results.push({path,status:0,ok:false});}
  }
  const ok=results.every(x=>x.ok);
  return new Response(JSON.stringify({dataset:'VANDIRA STEP85 data health',ok,checked_at:new Date().toISOString(),checks:results,canonical_data_policy:'read-only'}),{status:ok?200:503,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',}});
}
