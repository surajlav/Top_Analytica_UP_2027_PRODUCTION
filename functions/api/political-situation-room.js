const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate','pragma':'no-cache',};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
async function get(url){try{const r=await fetch(url,{headers:{'user-agent':'VANDIRA-UP-2027/STEP110'}}); if(!r.ok) return null; return await r.json();}catch{return null}}
const clean=(x)=>String(x||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
function severityText(items=[]){return items.reduce((a,x)=>{const s=String(x.severity||'').toLowerCase();a[s]=(a[s]||0)+1;return a},{critical:0,high:0,medium:0,low:0});}
export async function onRequestOptions(){return new Response('',{status:204,headers:H})}
export async function onRequestGet({request}){
 const u=new URL(request.url); const ac=Number(u.searchParams.get('ac')||u.searchParams.get('ac_no')||0)||null; const q=u.searchParams.get('q')||'';
 const base=u.origin;
 const [monitor,briefing,news,health,party,competitive,issues,scenario,campaign,constituency]=await Promise.all([
  get(`${base}/api/proactive-monitor${ac?'?ac='+ac:''}`),
  get(`${base}/api/daily-briefing${ac?'?ac='+ac:''}`),
  get(`${base}/api/up-politics-feed`), get(`${base}/api/system-health`),
  get(`${base}/api/party-intelligence${ac?'?ac='+ac:''}`), get(`${base}/api/competitive-intelligence${ac?'?ac='+ac:''}`),
  get(`${base}/api/issue-ground-intelligence${ac?'?ac='+ac:''}`), get(`${base}/api/scenario-decision-support${ac?'?ac='+ac:''}`),
  get(`${base}/api/campaign-planning${ac?'?ac='+ac:''}`), get(`${base}/api/constituency-360${ac?'?ac='+ac:''}${q?'&q='+encodeURIComponent(q):''}`)
 ]);
 const alerts=monitor?.alerts||[]; const signals=monitor?.current_signals||news?.items||news?.results||[];
 const feed=(news?.items||news?.results||[]).slice(0,12).map(x=>({title:clean(x.headline||x.title),summary:clean(x.summary||x.description),url:x.source_url||x.url,source:x.source||'',published_at:x.published_at||null,tier:Number(x.source_tier||2)}));
 const official=feed.filter(x=>x.tier===1).length;
 return json({ok:true,step:'STEP110',name:'VANDIRA Political Situation Room',checked_at:new Date().toISOString(),scope:ac?{level:'assembly',ac_no:ac}:{level:'state'},query:q||null,command:{what_changed:alerts.slice(0,8),why_it_matters:(briefing?.sections?.why_it_matters||briefing?.why_it_matters||[]).slice(0,8),attention:alerts.slice(0,8).map(x=>x.title)},political:{signals:feed.slice(0,8),signal_count:signals.length},campaign:{status:campaign?.status||campaign?.current_intelligence_status||'evidence_required',workstreams:campaign?.workstreams||[],timeline:campaign?.timeline||[]},issues:{status:issues?.status||'current_evidence_required',items:(issues?.items||issues?.issue_signals||[]).slice(0,8)},competitive:{status:competitive?.status||'current_evidence_required',items:(competitive?.items||competitive?.comparisons||[]).slice(0,8)},party:{entity:party?.entity||null,status:party?.status||'verification_required'},scenario:{status:scenario?.status||'conditional_only',items:(scenario?.scenarios||scenario?.items||[]).slice(0,5)},constituency:constituency?.profile||constituency?.entity||null,alerts:{count:alerts.length,severity:severityText(alerts)},system:{health:health?.status||health?.ok||'unknown',official_signal_count:official,provider:health?.ai_provider||health?.provider||'not-configured'},guardrails:['Current claims require fresh evidence','Reported news remains attributed until verified','2024 Lok Sabha context is never treated as a 2024 Assembly result','No unsupported 2027 winner prediction or probability','No sensitive voter profiling or targeting'],provenance:{sources:['VANDIRA Proactive Monitoring','UP Politics Feed','Daily Briefing','Official connectors','Election warehouse'],live_retrieval:true}});
}
