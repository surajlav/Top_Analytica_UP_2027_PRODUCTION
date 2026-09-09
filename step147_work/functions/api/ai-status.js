import {configuredProviders,defaultModel} from './ai-providers.js';
export async function onRequestGet({env}){
  const p=configuredProviders(env);
  return new Response(JSON.stringify({step:'STEP120',service:'VANDIRA AI provider router',providers:p.map(x=>({...x,default_model:defaultModel(x.id)})),configured_count:p.filter(x=>x.configured).length,notes:['Provider keys are read only from server environment variables.','Free-tier availability and rate limits are provider-controlled and may change.','No API key is returned to the browser.', 'Unified integration health: GET /api/ai-integration.', 'Live model synthesis is available only when at least one provider is actually configured.']}),{headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',}});
}
