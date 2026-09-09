import {securityHeaders,rateLimitDistributed,validateBody,API_SECURITY_LIMITS} from './lib/api-security.js';
import {runtimeEvent,shouldPersistEvent,persistRuntimeEvent,observabilityConfig} from './lib/observability.js';

export async function onRequest(context){
  const {request,env,next,waitUntil}=context;
  const started=Date.now();
  const method=request.method.toUpperCase();
  const headers=securityHeaders(request,env);
  const requestId=headers['X-Request-ID'];
  headers['X-Request-ID']=requestId;

  const finish=(response)=>{
    const out=new Response(response.body,{status:response.status,statusText:response.statusText,headers:new Headers(response.headers)});
    const duration=Date.now()-started;
    const event=runtimeEvent({request_id:requestId,method,route:new URL(request.url).pathname,status:out.status,duration_ms:duration});
    const finalHeaders=securityHeaders(request,env);
    for(const [k,v] of Object.entries(finalHeaders)) out.headers.set(k,v);
    out.headers.set('X-Request-ID',requestId);
    if(shouldPersistEvent(event) && env?.VANDIRA_OBSERVABILITY_KV){
      const job=persistRuntimeEvent(env,event);
      if(typeof waitUntil==='function') waitUntil(job); else job.catch(()=>{});
    }
    out.headers.set('Server-Timing',`vandira;dur=${duration}`);
    return out;
  };

  if(!['GET','HEAD','POST','OPTIONS'].includes(method)){
    return finish(new Response(JSON.stringify({error:'method_not_allowed'}),{status:405,headers:{...headers,'Allow':'GET,HEAD,POST,OPTIONS'}}));
  }

  if(method==='OPTIONS'){
    const origin=request.headers.get('Origin');
    if(origin && !headers['Access-Control-Allow-Origin']) return finish(new Response(JSON.stringify({error:'cors_origin_not_allowed'}),{status:403,headers}));
    return finish(new Response(null,{status:204,headers}));
  }

  const rl=await rateLimitDistributed(request,env);
  headers['X-RateLimit-Limit']=String(rl.limit);
  headers['X-RateLimit-Remaining']=String(rl.remaining);
  headers['X-RateLimit-Reset']=String(Math.ceil(rl.reset/1000));
  headers['X-RateLimit-Policy']=String(rl.backend||'local_isolate');
  if(!rl.ok){
    headers['Retry-After']=String(Math.max(1,Math.ceil((rl.reset-Date.now())/1000)));
    return finish(new Response(JSON.stringify({error:'rate_limit_exceeded',retry_after_seconds:Number(headers['Retry-After'])}),{status:429,headers}));
  }

  const isApi=new URL(request.url).pathname.startsWith('/api/');
  if(isApi && method==='POST'){
    const max=request.url.includes('/api/ai')?API_SECURITY_LIMITS.MAX_AI_BODY_BYTES:API_SECURITY_LIMITS.MAX_BODY_BYTES;
    const check=await validateBody(request,max);
    if(!check.ok) return finish(new Response(JSON.stringify({error:check.reason,max_bytes:check.max_bytes||max}),{status:check.reason==='payload_too_large'?413:415,headers}));
  }

  let response;
  try{ response=await next(); }
  catch(err){
    const body=JSON.stringify({error:'internal_server_error',request_id:requestId});
    response=new Response(body,{status:500,headers});
  }
  return finish(response);
}
