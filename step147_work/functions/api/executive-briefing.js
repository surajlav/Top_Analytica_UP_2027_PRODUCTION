const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate','pragma':'no-cache'};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
async function get(url){try{const r=await fetch(url,{headers:{'user-agent':'VANDIRA-UP-2027/STEP111'}});if(!r.ok)return null;return await r.json()}catch{return null}}
const clean=x=>String(x??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const arr=x=>Array.isArray(x)?x:[];
export async function onRequestGet({request}){
 const u=new URL(request.url); const ac=Number(u.searchParams.get('ac')||0)||null; const q=u.searchParams.get('q')||''; const base=u.origin;
 const qs=new URLSearchParams(); if(ac)qs.set('ac',ac); if(q)qs.set('q',q);
 const [room,briefing,health]=await Promise.all([get(`${base}/api/political-situation-room${qs.toString()?'?'+qs:''}`),get(`${base}/api/daily-briefing${ac?'?ac='+ac:''}`),get(`${base}/api/system-health`)]);
 if(!room)return json({ok:false,error:'situation_room_unavailable'},503);
 const alerts=arr(room.alerts?.count?room.command?.what_changed:[]);
 const changed=arr(room.command?.what_changed).slice(0,6).map(x=>({title:clean(x.title||x.headline||'Signal'),summary:clean(x.summary||x.description||''),severity:x.severity||'medium',source:x.source||'',published_at:x.published_at||null}));
 const why=arr(room.command?.why_it_matters).slice(0,6).map(x=>clean(typeof x==='string'?x:(x.title||x.summary||''))).filter(Boolean);
 const attention=arr(room.command?.attention).slice(0,6).map(x=>clean(typeof x==='string'?x:(x.title||x.name||''))).filter(Boolean);
 const sections=briefing?.sections||{};
 const facts=arr(sections.verified_facts||sections.key_facts||sections.election_context).slice(0,6).map(x=>clean(typeof x==='string'?x:(x.title||x.summary||x.text||''))).filter(Boolean);
 const gaps=[...(room.guardrails||[]),...arr(briefing?.data_gaps||sections.data_gaps)].map(clean).filter(Boolean).slice(0,8);
 return json({ok:true,step:'STEP111',name:'VANDIRA Executive / Leadership Briefing',checked_at:new Date().toISOString(),scope:room.scope,headline: changed[0]?.title||'No material new signal identified',executive_summary:why[0]||'Current evidence should be reviewed before strategic action.',sections:{what_changed:changed,where:room.scope?.level==='assembly'?(room.constituency?.name||`AC ${room.scope.ac_no}`):'Uttar Pradesh',why_it_matters:why,electoral_context:facts,what_requires_attention:attention.length?attention:['Continue evidence monitoring and verification.'],risk:changed.filter(x=>['critical','high'].includes(String(x.severity).toLowerCase())).map(x=>x.title),opportunity:arr(room.scenario?.items).slice(0,4).map(x=>clean(x.title||x.name||x.assumption||'Conditional scenario')),next_actions:attention.slice(0,5),data_gaps:gaps},evidence_quality:{official_signal_count:room.system?.official_signal_count||0,political_signal_count:room.political?.signal_count||0,active_alerts:room.alerts?.count||0,live_retrieval:true},provenance:{situation_room:'STEP110',daily_briefing:'STEP99',official_connectors:true,election_warehouse:true},guardrails:['Leadership briefing is decision support, not an election forecast','Current claims require fresh evidence','2024 Lok Sabha context is separate from 2024 Assembly','No unsupported probabilities or winner claims','No sensitive voter profiling or targeting'],system:{health:room.system?.health||health?.status||'unknown',provider:room.system?.provider||health?.ai_provider||health?.provider||'not-configured'}});
}
