const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate','pragma':'no-cache',};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
const EVENT_TYPES=['polling_started','turnout_update','booth_incident','queue_signal','election_official_update','security_incident','election_process_update','counting_update','result_update','other'];
const SEVERITIES=['info','low','medium','high','critical'];
const asNum=v=>Number.isFinite(Number(v))?Number(v):null;
function turnout(totalElectors,reportedVoters){
  const t=asNum(totalElectors),v=asNum(reportedVoters);
  if(!(t>0)&&!(v>=0)) return {status:'not_observed',turnout_pct:null};
  if(!(t>0)||v<0||v>t) return {status:'invalid_input',turnout_pct:null};
  return {status:'observed',turnout_pct:Math.round((v/t)*10000)/100};
}
function readiness(){
  return [
    {id:'official_poll_date',label:'Official poll date/time',status:'pending',evidence:'ECI/CEO UP notification required'},
    {id:'booth_universe',label:'Assembly booth universe',status:'baseline_available',evidence:'STEP89 normalized booth totals'},
    {id:'booth_detail',label:'Detailed booth records',status:'source_dependent',evidence:'Only claim completeness when source coverage supports it'},
    {id:'turnout_feed',label:'Turnout observation feed',status:'not_configured',evidence:'No live turnout feed is embedded'},
    {id:'incident_log',label:'Incident/event logging',status:'ready_local_first',evidence:'Browser-local operational log'},
    {id:'official_updates',label:'Official election updates',status:'ready_for_fresh_retrieval',evidence:'ECI/CEO UP official connectors'},
    {id:'counting_mode',label:'Counting/result mode',status:'standby',evidence:'Activate only after official counting information is available'}
  ];
}
export async function onRequestGet({request}){
  const u=new URL(request.url);
  const ac=asNum(u.searchParams.get('ac'));
  const scope=ac&&ac>=1&&ac<=403?{level:'assembly',ac_no:ac}:{level:'state',state:'Uttar Pradesh'};
  return json({ok:true,step:'STEP115',name:'VANDIRA Election-Day Intelligence',checked_at:new Date().toISOString(),scope,election_status:{official_poll_date_confirmed:false,official_poll_date:null,house_term_end:'2027-05-22',mode:'readiness_until_official_schedule'},readiness:readiness(),event_types:EVENT_TYPES,severity_levels:SEVERITIES,turnout:{model:'observed_inputs_only',sample:{total_electors:null,reported_voters:null,turnout_pct:null,status:'not_observed'}},booth_intelligence:{assembly_booth_totals_available:true,detailed_booth_completeness:'source_dependent',do_not_assume_complete:true},counting:{status:'standby',official_results_required:true},audit:{event_id_required:true,timestamp_required:true,source_required_for_external_claims:true,local_log_default:true},provenance:{warehouse:'STEP89 ECI-normalized UP Assembly warehouse',official_sources:'STEP86 official connectors',monitoring:'STEP114 Monitoring + Performance Intelligence',war_room:'STEP113 Political War Room'},guardrails:['Do not invent or imply an official poll date before ECI/CEO UP confirmation','Turnout percentages require observed denominator and numerator','Do not treat booth totals as complete detailed booth records','Official election results remain authoritative for results','No sensitive voter profiling or targeting','No autonomous campaign decisions or outcome prediction']});
}
export async function onRequestPost({request}){
  let p={};try{p=await request.json()}catch{return json({ok:false,error:'invalid_json'},400)}
  const type=String(p.type||'other');
  if(!EVENT_TYPES.includes(type)) return json({ok:false,error:'invalid_event_type',allowed:EVENT_TYPES},400);
  const severity=String(p.severity||'info');
  if(!SEVERITIES.includes(severity)) return json({ok:false,error:'invalid_severity',allowed:SEVERITIES},400);
  const event_id=String(p.event_id||crypto.randomUUID());
  const recorded_at=String(p.recorded_at||new Date().toISOString());
  const source=String(p.source||'user-entered operational log');
  const t=turnout(p.total_electors,p.reported_voters);
  return json({ok:true,step:'STEP115',event:{event_id,type,severity,recorded_at,source,scope:p.scope||{level:'state',state:'Uttar Pradesh'},title:String(p.title||'Election-day event'),description:String(p.description||'').slice(0,2000),turnout:t,status:String(p.status||'observed')},validation:{turnout:t.status==='observed'?'accepted':t.status,external_claim_requires_source:source==='user-entered operational log'},guardrails:['Event logging does not establish truth of an external claim without source evidence','Turnout is computed only from supplied observed values','No sensitive voter attributes should be logged']});
}
