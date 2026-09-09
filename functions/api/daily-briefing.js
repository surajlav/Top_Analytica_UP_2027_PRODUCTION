import {runProviderCascade} from './ai-providers.js';
import {electionClock} from '../lib/vandira-os.js';
import {sanitizePersonalContext} from '../lib/personal-context.js';

const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate','pragma':'no-cache',};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
const strip=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const domain=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch{return ''}};
const tier=u=>/eci\.gov\.in$|information\.up\.gov\.in$|upvidhansabhaproceedings\.gov\.in$|pib\.gov\.in$/.test(domain(u))?1:/indianexpress\.com$|newindianexpress\.com$|moneycontrol\.com$|indiatoday\.in$|ndtv\.com$|news18\.com$/.test(domain(u))?2:3;
async function get(url){const r=await fetch(url,{headers:{'user-agent':'VANDIRA-UP-2027/STEP99'}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}
async function text(url){const r=await fetch(url,{headers:{'user-agent':'VANDIRA-UP-2027/STEP99'}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text()}
function rss(xml){return [...String(xml).matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(m=>m[1]).map(x=>{const g=n=>{const m=x.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${n}>`,'i'));return m?strip(m[1]):''};const u=g('link')||g('guid');return {title:g('title'),summary:g('description'),url:u,published_at:g('pubDate')||null,source:domain(u),tier:tier(u)}}).filter(x=>x.title&&x.url);
}
async function newsEvidence(request){
  const out=[];
  try{const d=await get(new URL('/api/up-politics-feed',request.url).toString());for(const x of (d.items||d.results||[]).slice(0,12))out.push({title:x.headline||x.title,summary:x.summary||x.description,url:x.source_url||x.url,published_at:x.published_at||null,source:x.source||domain(x.source_url||x.url),tier:Number(x.source_tier||2),live:true});}catch{}
  try{const xml=await text('https://news.google.com/rss/search?q='+encodeURIComponent('Uttar Pradesh politics election government')+'&hl=en-IN&gl=IN&ceid=IN:en');out.push(...rss(xml).slice(0,10).map(x=>({...x,discovery:true})));}catch{}
  return out;
}
async function officialEvidence(request){
  const out=[];
  for(const topic of ['government','eci','assembly']){try{const d=await get(new URL('/api/official-sources?topic='+topic+'&q='+encodeURIComponent('latest Uttar Pradesh '+topic),request.url).toString());for(const x of (d.links||[]).slice(0,5))out.push({title:x.title,summary:'Official source',url:x.url,published_at:null,source:x.source,tier:1,official:true});}catch{}}
  return out;
}
async function localElection(request,ac){
  try{const u=new URL('/api/eci-warehouse',request.url); if(ac) {u.searchParams.set('ac',String(ac));u.searchParams.set('mode','hybrid')} else u.searchParams.set('summary','1');const d=await get(u.toString());return d.record?{type:'constituency',record:d.record}:{type:'summary',summary:d.summary};}catch{return null}
}
function dedupe(items){const s=new Set();return items.filter(x=>{const k=(x.url||x.title||'').toLowerCase().replace(/\/$/,'');if(!k||s.has(k))return false;s.add(k);return true})}
function select(items){return dedupe(items).sort((a,b)=>(b.tier||3)-(a.tier||3)).slice(0,20)}
function fallbackBriefing({items,election,ac,clock,context}){
  const latest=items.filter(x=>x.published_at).sort((a,b)=>new Date(b.published_at)-new Date(a.published_at)).slice(0,6);
  const lines=[];
  lines.push('आज का VANDIRA Daily Political Briefing');
  lines.push(`स्थिति: ${items.length?`${items.length} attributable evidence items उपलब्ध हैं।`:'इस retrieval cycle में पर्याप्त live evidence उपलब्ध नहीं है।'}`);
  if(election?.record) lines.push(`सीट संदर्भ: ${election.record.constituency} (AC ${election.record.ac_no}) — 2022 verified baseline: ${election.record.winner||'winner record उपलब्ध'}, margin ${election.record.margin_votes??'—'}.`);
  else if(election?.summary) lines.push(`Election warehouse: ${election.summary.loaded_ac||0}/${election.summary.expected_ac||403} AC records loaded.`);
  lines.push('आज ध्यान देने योग्य developments:');
  latest.forEach(x=>lines.push(`• ${x.title} — ${x.source}`));
  if(!latest.length) lines.push('• नवीन प्रकाशित items मिळाले नाहीत; अनुमान केला जात नाही.');
  lines.push('VANDIRA assessment: ताज्या claims ना स्वतंत्रपणे verify करणे आवश्यक आहे; news reports ना established fact समजू नका.');
  lines.push(`अगला कदम: ${ac?'निवडलेल्या मतदारसंघासाठी संबंधित development ची seat-level verification करा.':'महत्त्वाच्या developments साठी official source + independent reporting cross-check करा.'}`);
  return lines.join('\n');
}
export async function onRequestOptions(){return new Response(null,{status:204,headers:H});}
export async function onRequestGet({request}){return build(request,{});}
export async function onRequestPost({request,env}){let p={};try{p=await request.json()}catch{}return build(request,p,env)}
async function build(request,p={},env={}){
  const ac=Number(p.ac_no||p.ac||0);const context=sanitizePersonalContext(p.personal_context||{});const [news,official,election]=await Promise.all([newsEvidence(request),officialEvidence(request),localElection(request,ac)]);const evidence=select([...official,...news]);
  const clock=electionClock();
  const system=`You are VANDIRA, a source-grounded political intelligence consultant for Uttar Pradesh. Produce a Daily Political Intelligence Briefing, not propaganda. Use only supplied evidence. Clearly separate verified election data, official current information, and reported news. Do not invent developments, alliances, forecasts or motives. Do not use sensitive personal data for political targeting. If evidence is thin or conflicting, say so. The briefing must contain: 1) What changed, 2) Why it matters, 3) Seat/election context when supported, 4) Evidence quality/confidence, 5) Data gaps, 6) VANDIRA assessment, 7) What needs attention today, 8) sources.`;
  const user=`DATE/TIME INDIA: ${clock?.india||new Date().toISOString()}\nELECTION CLOCK: ${JSON.stringify(clock)}\nSELECTED AC: ${ac||'state-wide'}\nUSER-CONTROLLED CONTEXT: ${JSON.stringify(context)}\nELECTION EVIDENCE: ${JSON.stringify(election)}\nCURRENT EVIDENCE: ${JSON.stringify(evidence)}\nReturn the briefing in the requested language if supplied in context.preferences.language, otherwise Hindi. Do not treat a 2024 Lok Sabha segment as a 2024 Assembly result.`;
  let provider=null,answer='';try{provider=await runProviderCascade(env,[{role:'system',content:system},{role:'user',content:user}],p.provider||'auto');answer=provider?.answer||'';}catch{}
  const providerStatus=answer?'connected':'not-configured';if(!answer)answer=fallbackBriefing({items:evidence,election,ac,clock,context});
  const latestPublished=evidence.filter(x=>x.published_at).sort((a,b)=>new Date(b.published_at)-new Date(a.published_at))[0]?.published_at||null;
  const confidence=evidence.filter(x=>x.tier===1).length>=1&&evidence.length>=3?'medium':evidence.length?'low':'low';
  return json({ok:true,step:'STEP99',briefing:answer,generated_at:new Date().toISOString(),india_time:clock?.india||null,scope:ac?{level:'constituency',ac_no:ac}: {level:'state'},evidence:evidence.map(x=>({title:x.title,url:x.url,source:x.source,published_at:x.published_at,tier:x.tier,official:Boolean(x.official),live:Boolean(x.live)})),evidence_count:evidence.length,latest_published_at:latestPublished,confidence,provider_status:providerStatus,provider:provider?.provider||null,provider_model:provider?.model||null,data_gaps:evidence.length<3?['Limited evidence breadth for a high-confidence daily briefing.']:[],guardrails:['Reported news is not automatically established fact','2024 Lok Sabha context remains separate from 2024 Assembly results','No invented forecasts or probabilities','No sensitive personal targeting'],retrieval_trace:{news_count:news.length,official_count:official.length,election_context:Boolean(election),selected_ac:ac||null,personal_context_fields:{objective:Boolean(context.objective),focus_areas:context.focus_areas?.length||0,pending_questions:context.pending_questions?.length||0}}});
}
