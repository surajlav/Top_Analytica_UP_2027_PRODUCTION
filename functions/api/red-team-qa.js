import {classifyQuery} from '../lib/vandira-os.js';
import {resolveEntities} from '../lib/entity-resolver.js';
import {guardAnswer} from '../lib/answer-guard.js';
import {buildEvidenceSecurity,secureUserQuery} from '../lib/untrusted-evidence.js';
import {validateAIInput} from '../lib/api-security.js';
import {providerAllowed} from '../lib/ai-provider-policy.js';
import {runRedTeamSuite} from '../lib/red-team.js';

export async function onRequestGet({env}){
  const suite=runRedTeamSuite({classifyQuery,resolveEntities,guardAnswer,buildEvidenceSecurity,secureUserQuery,validateAIInput,providerAllowed});
  return new Response(JSON.stringify({step:'STEP145',suite,policy:'Deterministic red-team QA only; live provider calls are intentionally not performed.'}),{status:suite.failed?500:200,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
}
