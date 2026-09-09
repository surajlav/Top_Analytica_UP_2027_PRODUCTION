const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store',};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
const n=v=>Number.isFinite(Number(v))?Number(v):null;
const bool=v=>v===true||v==='true'||v===1||v==='1';
function assess(s={}){
  const sample=n(s.sample_size), seats=n(s.constituencies_covered), dates=String(s.fieldwork_date||'').trim();
  const method=String(s.methodology||'').trim().toLowerCase();
  const weighted=bool(s.weighting_documented), questionnaire=bool(s.questionnaire_available), sponsor=String(s.sponsor||'').trim();
  const moe=n(s.margin_of_error);
  const checks={sample_size:sample!==null&&sample>0,constituency_coverage:seats!==null&&seats>0,fieldwork_date:Boolean(dates),methodology:method.length>0,weighting_documented:weighted,questionnaire_available:questionnaire,margin_of_error:moe!==null&&moe>0,sponsor_disclosed:Boolean(sponsor)};
  let score=0; if(checks.sample_size)score+=20; if(checks.constituency_coverage)score+=10; if(checks.fieldwork_date)score+=10; if(checks.methodology)score+=20; if(checks.weighting_documented)score+=15; if(checks.questionnaire_available)score+=10; if(checks.margin_of_error)score+=10; if(checks.sponsor_disclosed)score+=5;
  const grade=score>=85?'high':score>=65?'medium':score>=40?'low':'insufficient';
  const gaps=Object.entries(checks).filter(([,ok])=>!ok).map(([k])=>k);
  const interpretation=grade==='high'?'Strong metadata coverage; still verify sampling frame, fieldwork execution and source documentation.':grade==='medium'?'Usable as a research signal with material metadata gaps; do not treat as a standalone election estimate.':grade==='low'?'Limited research value until key methodology and sampling metadata are supplied.':'Insufficient evidence to assess survey quality.';
  return {assessment:{score,grade,checks,gaps,interpretation},survey_metadata:{sample_size:sample,constituencies_covered:seats,fieldwork_date:dates||null,methodology:method||null,weighting_documented:weighted,questionnaire_available:questionnaire,margin_of_error:moe,sponsor:sponsor||null},guardrails:{survey_not_equal_to_election_result:true,no_sensitive_demographic_inference:true,no_voter_profiling:true,no_2027_outcome_prediction:true,no_claim_of_representativeness_without_sampling_frame:true}};
}
export async function onRequestGet(){return json({step:'STEP106',schema_version:'step106.1',mode:'research_survey_intelligence',registered_surveys:0,coverage:{embedded_scientific_surveys:false,embedded_field_reports:false,embedded_primary_survey_responses:false},research_framework:{dimensions:['research_question','geography','population','sample','sampling_method','fieldwork_period','questionnaire','weighting','margin_of_error','sponsor','provenance','quality_assessment'],evidence_classes:['official_data','scientific_survey','field_report','media_signal','discovery_lead','ai_analysis']},data_gap:'No survey dataset is embedded in STEP106. Submit survey metadata to /api/research-survey-intelligence for deterministic quality assessment.'});}
export async function onRequestPost({request}){try{const body=await request.json(); if(!body||typeof body!=='object')return json({step:'STEP106',ok:false,error:'JSON object required'},400); return json({step:'STEP106',schema_version:'step106.1',...assess(body)});}catch(e){return json({step:'STEP106',ok:false,error:String(e?.message||e)},400)}}
