const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate','pragma':'no-cache',};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
const clean=x=>String(x??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const arr=x=>Array.isArray(x)?x:[];
async function get(url){try{const r=await fetch(url,{headers:{'user-agent':'VANDIRA-UP-2027/STEP113'}});if(!r.ok)return null;return await r.json()}catch{return null}}
function severity(alerts=[]){return alerts.reduce((a,x)=>{const s=String(x.severity||'medium').toLowerCase();a[s]=(a[s]||0)+1;return a},{critical:0,high:0,medium:0,low:0})}
export async function onRequestGet({request}){
 const u=new URL(request.url); const ac=Number(u.searchParams.get('ac')||0)||null; const q=clean(u.searchParams.get('q')||''); const base=u.origin;
 const suffix=ac?`?ac=${ac}`:''; const constituencyQs=ac?`?ac=${ac}${q?'&q='+encodeURIComponent(q):''}`:(q?`?q=${encodeURIComponent(q)}`:'');
 const [room,exec,monitor,brief,hierarchy,health]=await Promise.all([
  get(`${base}/api/political-situation-room${suffix}`),
  get(`${base}/api/executive-briefing${suffix}`),
  get(`${base}/api/proactive-monitor${suffix}`),
  get(`${base}/api/daily-briefing${suffix}`),
  get(`${base}/api/hierarchy-intelligence${constituencyQs}`),
  get(`${base}/api/system-health`)
 ]);
 if(!room && !exec) return json({ok:false,error:'war_room_unavailable'},503);
 const alerts=arr(monitor?.alerts||room?.command?.what_changed).slice(0,10);
 const changed=arr(room?.command?.what_changed||exec?.sections?.what_changed).slice(0,8);
 const attention=arr(room?.command?.attention||exec?.sections?.what_requires_attention).slice(0,8);
 const why=arr(room?.command?.why_it_matters||exec?.sections?.why_it_matters).slice(0,8);
 const signals=arr(room?.political?.signals).slice(0,10);
 const issues=arr(room?.issues?.items).slice(0,6);
 const competitive=arr(room?.competitive?.items).slice(0,6);
 const next=arr(exec?.sections?.next_actions||room?.command?.attention).slice(0,6);
 const gaps=arr(exec?.sections?.data_gaps||room?.guardrails).slice(0,8);
 const h=hierarchy?.hierarchy||hierarchy?.profile||hierarchy?.entity||null;
 return json({ok:true,step:'STEP113',name:'VANDIRA Political War Room',checked_at:new Date().toISOString(),scope:room?.scope||{level:ac?'assembly':'state',ac_no:ac},query:q||null,command:{headline:exec?.headline||changed[0]?.title||'No material new signal identified',summary:exec?.executive_summary||why[0]||'Evidence review required before strategic action.',what_changed:changed,why_it_matters:why,attention:attention,next_actions:next},alerts:{count:alerts.length,severity:severity(alerts),items:alerts},political:{signals,signal_count:room?.political?.signal_count||signals.length},operations:{issues,competitive,campaign:room?.campaign||null},decision_queue:attention.map((x,i)=>({priority:i<2?'high':i<5?'medium':'low',item:clean(typeof x==='string'?x:(x.title||x.name||x.summary||'')),evidence_required:true})).filter(x=>x.item),hierarchy:h,evidence:{official_signal_count:room?.system?.official_signal_count||0,live_retrieval:true,briefing_available:!!brief,monitoring_available:!!monitor},data_gaps:gaps,system:{health:room?.system?.health||health?.status||'unknown',provider:room?.system?.provider||health?.ai_provider||health?.provider||'not-configured'},provenance:{situation_room:'STEP110',executive_briefing:'STEP111',hierarchy:'STEP112',monitoring:'STEP100',daily_briefing:'STEP99'},guardrails:['War Room is evidence-led decision support, not autonomous campaign control','Current claims require fresh retrieval and attribution','2024 Lok Sabha context remains separate from Assembly results','No unsupported 2027 winner prediction or probability','No sensitive voter profiling, microtargeting, or demographic inference']});
}
