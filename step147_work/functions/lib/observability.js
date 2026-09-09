const MAX_ROUTE = 120;
const MAX_SOURCE = 80;
const MAX_SAMPLES = 50;

function clean(value, max=240){
  return String(value ?? '').replace(/[\r\n\t]+/g,' ').trim().slice(0,max);
}

export function runtimeEvent(input={}){
  const status=Number(input.status||0);
  const durationMs=Math.max(0,Math.round(Number(input.duration_ms ?? input.durationMs ?? 0)));
  return {
    ts:new Date().toISOString(),
    request_id:clean(input.request_id||input.requestId||crypto.randomUUID(),80),
    method:clean(input.method||'GET',12).toUpperCase(),
    route:clean(input.route||'unknown',MAX_ROUTE),
    status:Number.isFinite(status)?status:0,
    duration_ms:durationMs,
    outcome:status>=500?'server_error':status>=400?'client_error':'ok',
    slow:durationMs>=2000,
    source:clean(input.source||'vandira-runtime',MAX_SOURCE)
  };
}

export function shouldPersistEvent(event){
  return Number(event?.status)>=400 || Number(event?.duration_ms)>=2000 || Math.random()<0.02;
}

export async function persistRuntimeEvent(env,event){
  const kv=env?.VANDIRA_OBSERVABILITY_KV;
  if(!kv || !event) return {stored:false,backend:'not_configured'};
  const day=new Date().toISOString().slice(0,10);
  const key=`obs:event:${day}:${event.ts}:${event.request_id}`;
  try{
    await kv.put(key,JSON.stringify(event),{expirationTtl:60*60*24*14});
    return {stored:true,backend:'cloudflare_kv'};
  }catch{
    return {stored:false,backend:'cloudflare_kv_error'};
  }
}

export async function persistRateBucket(env,key,payload,ttlSeconds=120){
  const kv=env?.VANDIRA_RATE_LIMIT_KV;
  if(!kv) return {configured:false,stored:false};
  try{
    await kv.put(`rl:${key}`,JSON.stringify(payload),{expirationTtl:ttlSeconds});
    return {configured:true,stored:true};
  }catch{return {configured:true,stored:false};}
}

export async function readRateBucket(env,key){
  const kv=env?.VANDIRA_RATE_LIMIT_KV;
  if(!kv) return null;
  try{return await kv.get(`rl:${key}`,'json');}catch{return null;}
}

export function observabilityConfig(env={}){
  return {
    distributed_rate_limit_backend:env?.VANDIRA_RATE_LIMIT_KV?'cloudflare_kv':'local_isolate_fallback',
    observability_backend:env?.VANDIRA_OBSERVABILITY_KV?'cloudflare_kv':'platform_logs_only',
    audit_backend:env?.VANDIRA_AUDIT_KV?'cloudflare_kv':'local_event_summary',
    durable_rate_limit_is_best_effort:true,
    note:'KV counters are distributed-ready but not atomic. For strict global enforcement, add Cloudflare Rate Limiting or a Durable Object before high-risk public exposure.'
  };
}

export const OBSERVABILITY_LIMITS={MAX_SAMPLES};
