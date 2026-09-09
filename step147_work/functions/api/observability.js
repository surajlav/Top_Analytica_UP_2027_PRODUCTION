import {securityHeaders} from '../lib/api-security.js';
import {observabilityConfig} from '../lib/observability.js';

export async function onRequestGet({request,env}){
  return new Response(JSON.stringify({
    ok:true,
    step:'STEP140',
    service:'VANDIRA UP 2027',
    status:'observability-ready',
    timestamp:new Date().toISOString(),
    runtime:{platform:'Cloudflare Pages Functions',request_id:request.headers.get('X-Request-ID')||null},
    backends:observabilityConfig(env||{}),
    exposed_secrets:false,
    note:'This endpoint exposes configuration status only; request payloads, IP addresses, provider credentials and internal traces are not returned.'
  }),{status:200,headers:securityHeaders(request,env||{})});
}
