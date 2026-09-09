const norm = s => String(s || '').toLowerCase().normalize('NFKC');

const ACTIONS = {
  election_results: 'Verify the relevant ECI result/warehouse record and compare the requested metric only within the stated election year.',
  constituency_intelligence: 'Review constituency-level verified results, turnout and booth/Form 20 signals before drawing any competitive conclusion.',
  candidate_intelligence: 'Verify candidate identity, constituency, party label and result provenance before comparing candidates.',
  booth_intelligence: 'Use Form 20 as descriptive historical evidence; inspect coverage and data-quality gaps before extrapolating.',
  party_alliance: 'Cross-check current alliance or seat-sharing claims against official statements and multiple reputable reports.',
  government_policy: 'Verify the latest government/official release and distinguish an announced decision from implementation or outcome.',
  assembly_proceedings: 'Check the official Assembly/NEVA record and distinguish a proceeding, question or bill from enacted policy.',
  political_news: 'Review the freshest attributable reports, then separate reported claims from verified facts.',
  historical_context: 'Use ECI historical/statistical records first and keep historical relationships separate from 2027 forecasts.',
  election_forecast: 'Build explicit scenarios from verified historical and current evidence; do not present an invented probability or certainty.',
  system_status: 'Check runtime/provider health and distinguish infrastructure availability from data availability.'
};

function sourceTier(item){
  const n=Number(item?.source_tier ?? item?.tier ?? 99);
  return Number.isFinite(n)?n:99;
}
function recencyHours(item, now=Date.now()){
  const d=item?.published_at ? new Date(item.published_at).getTime() : NaN;
  if(!Number.isFinite(d)) return null;
  return Math.max(0,(now-d)/3600000);
}
function scoreItem(item, query='', now=Date.now()){
  let score=0;
  const tier=sourceTier(item);
  score += tier===1?55:tier===2?35:tier===3?18:10;
  if(item?.structured_dataset) score+=18;
  if(item?.official_connector || item?.live_official) score+=12;
  if(item?.provenance?.official_reference) score+=8;
  const age=recencyHours(item,now);
  if(age!==null){ if(age<=24) score+=12; else if(age<=168) score+=7; else if(age<=720) score+=3; }
  const qTokens=norm(query).split(/[^\p{L}\p{N}]+/u).filter(t=>t.length>2).slice(0,16);
  const text=norm(`${item?.headline||''} ${item?.summary||''}`);
  score += Math.min(15,qTokens.filter(t=>text.includes(t)).length*2);
  return Math.min(100,score);
}

function normalizeKey(item){
  const title=norm(item?.headline||item?.title||'').replace(/\s+/g,' ').trim();
  const url=norm(item?.source_url||item?.url||'').replace(/\/$/,'');
  return url || title;
}

function claimKey(item){
  const raw=norm(`${item?.headline||''} ${item?.summary||''}`)
    .replace(/https?:\/\/\S+/g,'')
    .replace(/[^\p{L}\p{N}\s]/gu,' ')
    .replace(/\s+/g,' ').trim();
  const tokens=raw.split(' ').filter(x=>x.length>3).slice(0,18);
  return tokens.join(' ');
}

export function assessEvidence(items=[], query='', options={}){
  const now=options.nowMs||Date.now();
  const input=Array.isArray(items)?items:[];
  const deduped=[]; const seen=new Set();
  for(const item of input){
    const k=normalizeKey(item); if(!k||seen.has(k)) continue; seen.add(k);
    deduped.push({...item,evidence_score:scoreItem(item,query,now)});
  }
  deduped.sort((a,b)=>b.evidence_score-a.evidence_score);
  const tier1=deduped.filter(x=>sourceTier(x)===1);
  const tier2=deduped.filter(x=>sourceTier(x)===2);
  const fresh=deduped.filter(x=>{const h=recencyHours(x,now); return h!==null&&h<=168;});
  const currentRequired=Boolean(options.current_required);
  const strengths=[];
  if(tier1.length) strengths.push('tier-1-primary');
  if(tier1.some(x=>x.structured_dataset)) strengths.push('structured-data');
  if(fresh.length) strengths.push('recent-evidence');
  if(tier1.length && tier2.length) strengths.push('primary-plus-independent-reporting');
  const gaps=[];
  if(!deduped.length) gaps.push('no-relevant-evidence');
  if(currentRequired && !fresh.length) gaps.push('no-fresh-evidence-for-current-claim');
  if(!tier1.length) gaps.push('no-tier-1-source');
  if(deduped.length<2) gaps.push('limited-evidence-breadth');
  if(input.some(x=>sourceTier(x)>=3)) gaps.push('reference-or-discovery-source-present');
  const conflicts=detectConflicts(deduped);
  if(conflicts.length) gaps.push('conflicting-claims-require-review');
  let confidence='low';
  if(deduped.length>=2 && tier1.length>=1 && conflicts.length===0) confidence='high';
  else if((tier1.length>=1 || tier2.length>=2) && conflicts.length===0) confidence='medium';
  if(conflicts.length && tier1.length===0) confidence='low';
  return {
    version:'step97.1',
    evidence_count:deduped.length,
    top_evidence:deduped.slice(0,8),
    source_mix:{tier1:tier1.length,tier2:tier2.length,tier3:deduped.filter(x=>sourceTier(x)===3).length,other:deduped.filter(x=>sourceTier(x)>3).length},
    freshness:{current_required:currentRequired,fresh_items:fresh.length,latest_published_at:deduped.find(x=>x.published_at)?.published_at||null},
    strengths,
    conflicts,
    gaps,
    confidence,
    evidence_sufficiency: confidence==='high'?'sufficient':confidence==='medium'?'usable-with-caveats':'insufficient-for-strong-conclusion'
  };
}

function detectConflicts(items){
  const conflicts=[];
  // Detect direct numeric disagreement when sources discuss the same metric/entity.
  const groups=new Map();
  for(const item of items){
    const text=norm(`${item?.headline||''} ${item?.summary||''}`);
    const nums=[...text.matchAll(/\b\d{1,3}(?:,\d{2,3})*(?:\.\d+)?\b/g)].map(m=>m[0]);
    if(!nums.length) continue;
    const entity=(text.match(/\bac\s*[-:]?\s*\d{1,3}\b/)||[])[0]||text.split(' ').slice(0,8).join(' ');
    const key=entity.replace(/\s+/g,' ').trim();
    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push({item,nums});
  }
  for(const [key,arr] of groups){
    const signatures=new Map();
    for(const x of arr){ const sig=x.nums.slice(0,4).join('|'); if(!signatures.has(sig)) signatures.set(sig,[]); signatures.get(sig).push(x.item); }
    if(signatures.size>1 && arr.length>=2){
      conflicts.push({type:'numeric_disagreement',key,sources:[...signatures.values()].flat().slice(0,4).map(x=>({source:x.source,headline:x.headline,url:x.source_url}))});
    }
  }
  return conflicts.slice(0,5);
}

export function buildAssessmentAndRecommendation({query='',route={},researchPlan={},assessment=null,entities=null}={}){
  const a=assessment||assessEvidence([],query,{current_required:Boolean(researchPlan?.intent?.freshness==='fresh'||route?.requires_fresh_sources)});
  const primary=route?.primary_route||'political_news';
  const blocked=a.confidence==='low' && a.evidence_count===0;
  const action=ACTIONS[primary]||'Retrieve authoritative evidence, assess uncertainty, then choose the next research step.';
  const recommendation={
    type: blocked?'evidence-gap':'evidence-backed-next-action',
    status:blocked?'blocked-pending-evidence':'ready-with-guardrails',
    action,
    rationale:a.gaps.length?`Evidence review identified ${a.gaps.length} gap(s): ${a.gaps.join(', ')}.`:'Evidence is sufficiently structured to support a bounded assessment.',
    confidence:a.confidence,
    not_a_prediction:primary==='election_forecast',
    entity:entities?.primary||null
  };
  return {
    version:'step97.1',
    assessment:{confidence:a.confidence,evidence_sufficiency:a.evidence_sufficiency,source_mix:a.source_mix,freshness:a.freshness,strengths:a.strengths,gaps:a.gaps,conflicts:a.conflicts},
    assessment_summary:a.confidence==='high'?'Strong evidence base with aligned primary/structured support.':a.confidence==='medium'?'Usable evidence base, but conclusions should carry caveats.':'Evidence is limited or unresolved; avoid strong conclusions.',
    recommendation,
    guardrails:['Do not invent facts, probabilities or missing candidate attributes','Do not treat allegations or reports as established facts','Keep 2024 Lok Sabha data separate from Assembly election results','Do not use sensitive personal attributes for political targeting','For forecasts, present scenarios and assumptions rather than certainty'],
    audit:{query,primary_route:primary,evidence_count:a.evidence_count,confidence:a.confidence,generated_at:new Date().toISOString()}
  };
}
