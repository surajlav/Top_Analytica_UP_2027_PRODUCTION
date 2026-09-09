import {configuredProviders} from './ai-providers.js';
import {classifyQuery,buildExecutionPlan,electionClock} from '../lib/vandira-os.js';

const MODULES = [
  ['ai_runtime','/api/ai','POST'],
  ['intelligence_router','/api/intelligence-router','POST'],
  ['provider_status','/api/ai-status','GET'],
  ['system_health','/api/system-health','GET'],
  ['data_health','/api/data-health','GET'],
  ['intelligence_graph','/api/intelligence-graph','GET'],
  ['candidate_360','/api/candidate-360','GET'],
  ['constituency_360','/api/constituency-360','GET'],
  ['party_alliance','/api/party-intelligence','GET'],
  ['competitive','/api/competitive-intelligence','GET'],
  ['issues_ground','/api/issue-ground-intelligence','GET'],
  ['research_survey','/api/research-survey-intelligence','GET'],
  ['campaign_planning','/api/campaign-planning','GET'],
  ['content_studio','/api/content-studio','GET'],
  ['situation_room','/api/political-situation-room','GET'],
  ['war_room','/api/war-room','GET'],
  ['executive_briefing','/api/executive-briefing','GET'],
  ['hierarchy','/api/hierarchy-intelligence','GET'],
  ['election_day','/api/election-day-intelligence','GET'],
  ['audit_security','/api/audit-security','GET'],
  ['daily_briefing','/api/daily-briefing','GET'],
  ['proactive_monitoring','/api/proactive-monitor','GET'],
  ['performance','/api/performance-intelligence','GET']
];

const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',}});

async function probe(request,name,path,method){
  if(method==='POST' && name==='ai_runtime') return {name,status:'wired',path,detail:'Primary model synthesis endpoint; not executed by health probe to avoid consuming provider quota.'};
  try{
    const u=new URL(path,request.url);
    if(name==='intelligence_graph') u.searchParams.set('summary','1');
    if(name==='candidate_360') u.searchParams.set('summary','1');
    if(name==='constituency_360') u.searchParams.set('summary','1');
    const r=await fetch(u.toString(),{method,headers:{'user-agent':'VANDIRA-UP-2027-STEP120-INTEGRATION','cache-control':'no-store'}});
    return {name,status:r.ok?'ok':'attention',http_status:r.status,path};
  }catch(e){return {name,status:'unavailable',path,error:String(e.message||e).slice(0,160)}}
}

export async function onRequestGet({request,env}){
  const providers=configuredProviders(env);
  const checks=await Promise.all(MODULES.map(x=>probe(request,...x)));
  const active=checks.filter(x=>x.status==='ok'||x.status==='wired').length;
  const attention=checks.filter(x=>x.status==='attention'||x.status==='unavailable').length;
  const providerReady=providers.some(x=>x.configured);
  return json({
    step:'STEP120',
    system:'VANDIRA UP Election 2027 Political Intelligence Operating System',
    integration:'full-ai-integration',
    status:attention===0 && providerReady?'ready':attention===0?'runtime-ready-provider-pending':'operational-with-attention',
    provider_readiness:{configured_count:providers.filter(x=>x.configured).length,providers:providers.map(x=>({id:x.id,label:x.label,configured:x.configured,model:x.model}))},
    module_summary:{total:checks.length,active,wired:checks.filter(x=>x.status==='wired').length,attention},
    modules:checks,
    architecture:{retrieval:'data-first + official/current evidence',reasoning:'VANDIRA research-plan + evidence assessment + provider cascade',context:'user-controlled local consultant context',voice:'browser STT/TTS + two-way controller',audit:'bounded provenance/security telemetry',canonical_data:'read-only'},
    election_clock:electionClock(),
    timestamp:new Date().toISOString(),
    note:providerReady?'At least one AI provider is configured; live model synthesis can run through /api/ai.':'No AI provider secret/binding is configured in this environment; retrieval and deterministic fallback remain active, but live model synthesis is unavailable.'
  });
}

export async function onRequestPost({request}){
  let p={}; try{p=await request.json()}catch{}
  const query=String(p.query||'').trim();
  if(!query) return json({error:'query_required'},400);
  const route=classifyQuery(query,p.context||{});
  return json({step:'STEP120',route,execution_plan:buildExecutionPlan(route,p.context||{}),contract:'Unified AI integration accepts one query/context contract and delegates retrieval, evidence assessment, provider synthesis and audit metadata to the existing VANDIRA runtime.'});
}
