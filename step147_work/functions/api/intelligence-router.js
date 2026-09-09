import {classifyQuery,buildExecutionPlan,electionClock} from '../lib/vandira-os.js';
export async function onRequestPost({request}){
  const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store',};
  let p={}; try{p=await request.json()}catch{}
  const query=String(p.query||'').trim();
  if(!query) return new Response(JSON.stringify({error:'query_required'}),{status:400,headers});
  const route=classifyQuery(query,p.context||{});
  return new Response(JSON.stringify({system:'VANDIRA UP Election 2027 Political Intelligence Operating System',route,execution_plan:buildExecutionPlan(route,p.context||{}),election_clock:electionClock()}),{headers});
}
