import {securityHeaders} from '../lib/api-security.js';
import {loadDataProvenance,provenanceLabel} from '../lib/data-provenance.js';
export async function onRequestGet({request,env}){
  const headers=securityHeaders(request,env);
  try{
    const report=await loadDataProvenance(request);
    const u=new URL(request.url); const ac=u.searchParams.get('ac');
    const body=ac?{step:'STEP138',ac:Number(ac),provenance:provenanceLabel(report,Number(ac)),policy:report.policy}:report;
    return new Response(JSON.stringify(body),{status:200,headers});
  }catch(e){return new Response(JSON.stringify({error:'provenance_unavailable'}),{status:503,headers});}
}
