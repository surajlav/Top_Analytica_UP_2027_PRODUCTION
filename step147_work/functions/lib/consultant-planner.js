import {electionClock} from './vandira-os.js';

const norm=s=>String(s||'').toLowerCase().normalize('NFKC');
const has=(q,arr)=>arr.some(x=>q.includes(x));

export function inferIntent(query, route={}, entities=null, context={}) {
  const q=norm(query);
  const primary=route?.primary_route||'political_news';
  let goal='inform';
  if(has(q,['recommend','should i','what next','recommendation','सलाह','क्या करना','अगला कदम','आगे क्या','क्या जाँच','क्या जांच','क्या करें','रणनीति'])) goal='recommend';
  else if(has(q,['compare','versus',' vs ','तुलना','कौन बेहतर'])) goal='compare';
  else if(has(q,['why','how','क्यों','कैसे'])) goal='explain';
  else if(has(q,['forecast','predict','projection','scenario','2027 में कौन','भविष्य','अनुमान','परिदृश्य','कौन जीतेगा'])) goal='forecast';
  else if(has(q,['latest','today','current','now','news','आज','अभी','ताजा','ताज़ा','वर्तमान'])) goal='monitor';
  if(primary==='election_forecast') goal='forecast';
  const time_scope=has(q,['2027'])?'2027':has(q,['2024'])?'2024-lok-sabha':has(q,['2022'])?'2022-assembly':has(q,['2017'])?'2017-assembly':has(q,['2012'])?'2012-assembly':goal==='monitor'?'current':'unspecified';
  const geography=entities?.primary?.district?{level:'constituency',name:entities.primary.name,district:entities.primary.district,ac_no:entities.primary.ac_no}:context?.ac_no?{level:'constituency',ac_no:Number(context.ac_no)}:{level:'state',name:'Uttar Pradesh'};
  const analysis_mode=primary==='election_forecast'?'scenario':primary==='booth_intelligence'?'descriptive-booth':primary==='candidate_intelligence'?'entity-profile':primary==='political_news'?'current-affairs':primary==='historical_context'?'historical':primary;
  const output_need=goal==='recommend'?'assessment-and-next-action':goal==='compare'?'comparison':goal==='forecast'?'scenario-analysis':'answer-with-evidence';
  return {goal,time_scope,geography,entity_scope:entities?.primary||null,analysis_mode,freshness:route?.requires_fresh_sources||['current','2027'].includes(time_scope)?'fresh':'stable-or-fresh-as-needed',output_need};
}

const DOMAIN_STEPS={
 election_results:['eci','election_data','warehouse'], constituency_intelligence:['constituency','warehouse','booth'], candidate_intelligence:['candidate','warehouse','eci'], booth_intelligence:['booth','form20','warehouse'], party_alliance:['party','official','news'], government_policy:['government','official','assembly'], assembly_proceedings:['assembly','official'], political_news:['news','official'], historical_context:['history','eci','reference'], election_forecast:['warehouse','historical','news','official'], system_status:['runtime','health']
};

export function buildConsultantResearchPlan({query,route,entities,context={}}){
  const intent=inferIntent(query,route,entities,context);
  const domains=[...(DOMAIN_STEPS[route?.primary_route]||DOMAIN_STEPS.political_news)];
  const sources=[];
  if(domains.includes('eci')) sources.push({source:'ECI',tier:1,reason:'official election/statistical evidence'});
  if(domains.includes('official')||domains.includes('government')||domains.includes('assembly')) sources.push({source:'UP official institutions',tier:1,reason:'current government/assembly evidence'});
  if(domains.includes('warehouse')||domains.includes('election_data')) sources.push({source:'VANDIRA verified election warehouse',tier:1,reason:'structured 2022 election facts'});
  if(domains.includes('booth')||domains.includes('form20')) sources.push({source:'VANDIRA Form 20 derived data',tier:1,reason:'descriptive booth evidence'});
  if(domains.includes('candidate')) sources.push({source:'VANDIRA candidate intelligence API',tier:1,reason:'winner/runner-up identity and result context'});
  if(domains.includes('news')) sources.push({source:'fresh news discovery + Indian Express Political Pulse',tier:2,reason:'current reported developments'});
  if(domains.includes('history')) sources.push({source:'ECI historical reports + reference sources',tier:1,reason:'historical context'});
  if(domains.includes('reference')) sources.push({source:'reference sources',tier:3,reason:'context only, not sole authority for current facts'});
  const steps=[
    {id:'understand_intent',status:'ready',detail:`Goal=${intent.goal}; output=${intent.output_need}`},
    {id:'resolve_entities',status:entities?.primary?'ready':'partial',detail:entities?.primary?`Primary entity=${entities.primary.name||entities.primary.id}`:'No specific entity resolved; use state scope'},
    {id:'load_graph_context',status:'ready',detail:'Check bounded relationships around resolved constituency/candidate/party/election entities'},
    {id:'select_data_domains',status:'ready',detail:domains.join(', ')},
    {id:'select_required_sources',status:'ready',detail:sources.map(s=>s.source).join(', ')},
    {id:'retrieve_structured_evidence',status:'required',detail:'Prefer canonical/warehouse/Form20 structured evidence where applicable'},
    {id:'retrieve_fresh_evidence_if_needed',status:intent.freshness==='fresh'?'required':'conditional',detail:intent.freshness==='fresh'?'Current claim requires fresh retrieval':'Fresh retrieval only if query or evidence age requires it'},
    {id:'check_conflicts',status:'required',detail:'Prefer tier-1 primary evidence and disclose unresolved conflicts'},
    {id:'assess_evidence',status:'required',detail:'Score source tier, recency, completeness and agreement'},
    {id:'prepare_analysis',status:'required',detail:intent.analysis_mode==='scenario'?'Use explicit scenarios; no invented probabilities':'Separate verified facts from derived analysis'},
    {id:'identify_gaps',status:'required',detail:'List missing, stale, ambiguous or incomplete evidence'},
    {id:'prepare_next_action',status: intent.goal==='recommend'?'required':'conditional',detail:intent.goal==='recommend'?'Produce evidence-backed next action':'Offer a useful next research/action step only when warranted'},
    {id:'attach_provenance',status:'required',detail:'Attach source, tier, timestamp/freshness and dataset provenance'},
    {id:'emit_audit',status:'required',detail:'Emit route, intent, entities, evidence counts and guardrails'}
  ];
  const clock=electionClock();
  const guardrails=['Do not invent facts or candidates','Do not convert 2024 Lok Sabha data into 2024 Assembly results','Forecasts are scenarios, not certainties','Political recommendations must not use sensitive personal targeting','Disclose evidence gaps and conflicts'];
  return {version:'step96.1',intent,domains,required_sources:sources,steps,guardrails,temporal_context:clock,context:{ac_no:Number(context?.ac_no||context?.acNo||entities?.primary?.ac_no||0)||null}};
}
