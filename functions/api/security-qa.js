import {securityHeaders,allowedOrigin,rateLimit,rateLimitDistributed,validateBody,validateAIInput,publicTrace} from '../lib/api-security.js';
import {observabilityConfig,runtimeEvent} from '../lib/observability.js';

const req=(url='https://example.pages.dev/api/ai',init={})=>new Request(url,{method:init.method||'GET',headers:init.headers||{},body:init.body});

export async function onRequestGet({request,env}){
  const same=req('https://example.pages.dev/api/ai',{headers:{Origin:'https://example.pages.dev'}});
  const foreign=req('https://example.pages.dev/api/ai',{headers:{Origin:'https://evil.example'}});
  const h=securityHeaders(same,env||{});
  const foreignH=securityHeaders(foreign,env||{});
  const event=runtimeEvent({method:'GET',route:'/api/security-qa',status:200,duration_ms:12,request_id:'qa'});
  const checks=[
    {name:'same-origin CORS allowed',pass:allowedOrigin(same,env||{})==='https://example.pages.dev'},
    {name:'foreign CORS denied',pass:allowedOrigin(foreign,env||{})===null},
    {name:'security headers present',pass:['X-Content-Type-Options','X-Frame-Options','Referrer-Policy','Content-Security-Policy','Cross-Origin-Resource-Policy','X-Request-ID'].every(k=>Boolean(h[k]))},
    {name:'foreign response has no CORS grant',pass:!foreignH['Access-Control-Allow-Origin']},
    {name:'AI query length validation',pass:validateAIInput({query:'x'.repeat(2001)}).reason==='query_too_long'},
    {name:'AI context shape validation',pass:validateAIInput({query:'ok',context:[]}).reason==='invalid_context'},
    {name:'public trace redaction',pass:!Object.prototype.hasOwnProperty.call(publicTrace({provider:'secret-provider',provider_model:'secret-model',provider_attempts:['secret'],primary_route:'x'},{VANDIRA_DEBUG_TRACE:'false'}),'provider')},
    {name:'runtime event contains no raw payload',pass:!Object.keys(event).some(k=>/body|query|payload|ip/i.test(k))},
    {name:'observability config is sanitized',pass:!JSON.stringify(observabilityConfig(env||{})).includes('SECRET')},
  ];
  const body=await validateBody(req('https://example.pages.dev/api/ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query:'ok'})}),1024);
  checks.push({name:'JSON body validation',pass:body.ok===true});
  const rl=rateLimit(req('https://example.pages.dev/api/ai',{method:'POST'}),env||{});
  checks.push({name:'local rate-limit metadata',pass:rl.limit===10 && Number.isInteger(rl.remaining)});
  const drl=await rateLimitDistributed(req('https://example.pages.dev/api/ai',{method:'POST'}),env||{});
  checks.push({name:'distributed limiter fallback is safe',pass:drl.ok===true && Boolean(drl.backend)});
  const passed=checks.filter(x=>x.pass).length;
  return new Response(JSON.stringify({step:'STEP140',suite:'Distributed Rate Limiting, Abuse Protection & Production Observability',passed,total:checks.length,all_pass:passed===checks.length,checks,backends:observabilityConfig(env||{})}),{status:200,headers:securityHeaders(request,env||{})});
}
