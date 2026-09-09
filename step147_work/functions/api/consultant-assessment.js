import {assessEvidence,buildAssessmentAndRecommendation} from '../lib/evidence-protocol.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store',};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
export async function onRequestPost({request}){
 try{
  const p=await request.json();
  const query=String(p?.query||'').trim();
  if(!query)return json({ok:false,error:'query_required'},400);
  const route=p?.route||{};
  const researchPlan=p?.research_plan||{};
  const items=Array.isArray(p?.evidence)?p.evidence:[];
  const assessment=assessEvidence(items,query,{current_required:Boolean(p?.current_required||route?.requires_fresh_sources||researchPlan?.intent?.freshness==='fresh')});
  const result=buildAssessmentAndRecommendation({query,route,researchPlan,assessment,entities:p?.entities||null});
  return json({ok:true,step:'STEP97',...result,evidence:assessment.top_evidence});
 }catch(e){return json({ok:false,error:String(e?.message||e)},500)}
}
