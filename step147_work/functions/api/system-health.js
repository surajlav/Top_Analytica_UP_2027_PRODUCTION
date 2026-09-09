import {configuredProviders} from './ai-providers.js';
import {electionClock} from '../lib/vandira-os.js';
export async function onRequestGet({env}){
  const providers=configuredProviders(env);
  const checks={
    runtime:'ok',
    provider_router:'ok',
    canonical_data:'read-only',
    pages_functions:'active',
    production_domain:'untouched',
    live_ai_synthesis:providers.some(x=>x.configured)?'configured':'not_configured'
  };
  return new Response(JSON.stringify({system:'VANDIRA UP Election 2027 Political Intelligence Operating System',status:'operational-core',checks,configured_provider_count:providers.filter(x=>x.configured).length,providers:providers.map(x=>({id:x.id,label:x.label,configured:x.configured,model:x.model})),election_clock:electionClock(),timestamp:new Date().toISOString()}),{headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',}});
}
