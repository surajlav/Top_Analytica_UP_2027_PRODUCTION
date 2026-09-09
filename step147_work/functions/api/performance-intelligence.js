const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate','pragma':'no-cache',};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
const TARGETS=[
  {id:'system_health',path:'/api/system-health',critical:true},
  {id:'data_health',path:'/api/data-health',critical:true},
  {id:'monitoring',path:'/api/proactive-monitor',critical:false},
  {id:'war_room',path:'/api/war-room',critical:false}
];
const statusFor=(ms,ok)=>!ok?'unavailable':ms<=800?'healthy':ms<=1800?'degraded':ms<=3500?'attention':'unavailable';
async function probe(base,target){
  const started=performance.now();
  try{
    const r=await fetch(base+target.path,{headers:{'cache-control':'no-cache','user-agent':'VANDIRA-UP-2027/STEP114'},cache:'no-store'});
    const ms=Math.round(performance.now()-started);
    let body=null; try{body=await r.json()}catch{}
    return {id:target.id,ok:r.ok,status:r.status,latency_ms:ms,health:statusFor(ms,r.ok),critical:target.critical,summary:body?.status||body?.ok===true?'ok':body?.error||null};
  }catch(e){return {id:target.id,ok:false,status:0,latency_ms:null,health:'unavailable',critical:target.critical,summary:'request_failed'};}
}
export async function onRequestGet({request}){
  const u=new URL(request.url); const base=u.origin; const checked_at=new Date().toISOString();
  const probes=await Promise.all(TARGETS.map(x=>probe(base,x)));
  const system=probes.find(x=>x.id==='system_health');
  let systemBody=null; try{const r=await fetch(base+'/api/system-health',{cache:'no-store'});systemBody=await r.json()}catch{}
  const providers=Array.isArray(systemBody?.providers)?systemBody.providers:[];
  const configured=Number(systemBody?.configured_provider_count||0);
  const monitoring=probes.find(x=>x.id==='monitoring');
  const overall=probes.some(x=>x.critical&&x.health==='unavailable')?'attention':probes.some(x=>x.health==='unavailable')?'degraded':probes.some(x=>x.health==='attention')?'attention':probes.some(x=>x.health==='degraded')?'degraded':'healthy';
  const avg=probes.filter(x=>Number.isFinite(x.latency_ms)).reduce((a,x)=>a+x.latency_ms,0)/(probes.filter(x=>Number.isFinite(x.latency_ms)).length||1);
  return json({ok:true,step:'STEP114',name:'VANDIRA Monitoring + Performance Intelligence',checked_at,overall_status:overall,summary:{probes_total:probes.length,probes_ok:probes.filter(x=>x.ok).length,average_latency_ms:Math.round(avg),slowest:probes.filter(x=>Number.isFinite(x.latency_ms)).sort((a,b)=>b.latency_ms-a.latency_ms)[0]?.id||null},runtime:{status:system?.health||'unavailable',providers_configured:configured,providers_total:providers.length,live_ai_synthesis:systemBody?.checks?.live_ai_synthesis||'unknown'},probes,monitoring:{status:monitoring?.health||'unavailable',signal_endpoint_reachable:!!monitoring?.ok},data_health:{status:probes.find(x=>x.id==='data_health')?.health||'unavailable',read_only:true},thresholds_ms:{healthy:800,degraded:1800,attention:3500},interpretation:['Latency is measured at check time and is not a historical uptime claim.','Provider not configured is distinct from provider failure.','Political signals remain evidence/provenance governed.'],provenance:{system_health:'/api/system-health',data_health:'/api/data-health',monitoring:'/api/proactive-monitor',war_room:'/api/war-room'},guardrails:['No sensitive voter profiling or targeting','No political outcome inference from operational metrics','No fabricated uptime or performance history','Canonical election data remains read-only']});
}
