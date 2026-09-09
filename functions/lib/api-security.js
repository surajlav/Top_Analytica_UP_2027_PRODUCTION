import {readRateBucket,persistRateBucket} from './observability.js';

const WINDOW_MS = 60_000;
const buckets = new Map();

const DEFAULT_LIMITS = { GET: 180, POST: 30, PUT: 20, PATCH: 20, DELETE: 10 };
const SENSITIVE_POST_LIMIT = 10;
const MAX_BODY_BYTES = 512 * 1024;
const MAX_AI_BODY_BYTES = 256 * 1024;
const MAX_QUERY_CHARS = 2000;

function clean(value, max=300){
  return String(value ?? '').replace(/[\r\n\t]+/g,' ').trim().slice(0,max);
}

function configuredOrigins(env){
  return String(env?.VANDIRA_ALLOWED_ORIGINS || '')
    .split(',').map(x=>x.trim()).filter(Boolean);
}

export function requestId(request){
  return clean(request.headers.get('x-request-id') || crypto.randomUUID(), 80);
}

export function allowedOrigin(request, env){
  const origin = request.headers.get('Origin');
  if(!origin) return null;
  const allowed = new Set(configuredOrigins(env));
  try{
    const requestOrigin = new URL(request.url).origin;
    allowed.add(requestOrigin);
  }catch{}
  if(allowed.has(origin)) return origin;
  // Explicit local development origins are safe for local QA only.
  if(/^https?:\/\/localhost(?::\d+)?$/i.test(origin) || /^https?:\/\/127\.0\.0\.1(?::\d+)?$/i.test(origin)) return origin;
  return null;
}

export function securityHeaders(request, env, extra={}){
  const h={
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0',
    'X-Content-Type-Options':'nosniff',
    'X-Frame-Options':'DENY',
    'Referrer-Policy':'strict-origin-when-cross-origin',
    'Permissions-Policy':'camera=(), geolocation=(), microphone=(self)',
    'Content-Security-Policy':"default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'",
    'Cross-Origin-Resource-Policy':'same-origin',
    'X-Permitted-Cross-Domain-Policies':'none',
    'X-Request-ID':requestId(request),
    ...extra
  };
  const origin=allowedOrigin(request,env);
  if(origin){
    h['Access-Control-Allow-Origin']=origin;
    h['Access-Control-Allow-Methods']='GET,POST,OPTIONS';
    h['Access-Control-Allow-Headers']='Content-Type, X-Request-ID';
    h['Access-Control-Max-Age']='600';
    h['Vary']='Origin';
  }
  try{ if(new URL(request.url).protocol==='https:') h['Strict-Transport-Security']='max-age=31536000; includeSubDomains'; }catch{}
  return h;
}

function bucketKey(request){
  const ip=clean(request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown',120);
  const route=new URL(request.url).pathname;
  return `${ip}|${route}|${request.method.toUpperCase()}`;
}

export function localRateLimit(request, env){
  const method=request.method.toUpperCase();
  if(method==='OPTIONS') return {ok:true,limit:0,remaining:0,reset:Date.now()+WINDOW_MS};
  const key=bucketKey(request);
  const now=Date.now();
  const prior=buckets.get(key);
  if(!prior || now-prior.started>=WINDOW_MS){
    const limit=method==='POST' && /\/(ai|eci-ingest|audit-security|personal-context|consultant-|content-studio|research-survey-intelligence)/.test(new URL(request.url).pathname) ? SENSITIVE_POST_LIMIT : (DEFAULT_LIMITS[method]||60);
    buckets.set(key,{started:now,count:1,limit});
    return {ok:true,limit,remaining:limit-1,reset:now+WINDOW_MS};
  }
  prior.count++;
  return {ok:prior.count<=prior.limit,limit:prior.limit,remaining:Math.max(0,prior.limit-prior.count),reset:prior.started+WINDOW_MS};
}

export async function rateLimitDistributed(request, env){
  const local=localRateLimit(request,env);
  const method=request.method.toUpperCase();
  if(method==='OPTIONS') return local;
  const kv=env?.VANDIRA_RATE_LIMIT_KV;
  if(!kv) return {...local,backend:'local_isolate'};
  const ip=clean(request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown',120);
  const route=new URL(request.url).pathname;
  const limit=local.limit;
  const windowStart=Math.floor(Date.now()/WINDOW_MS)*WINDOW_MS;
  const key=`${ip}|${route}|${method}|${windowStart}`;
  const existing=await readRateBucket(env,key);
  const count=Number(existing?.count||0)+1;
  const reset=windowStart+WINDOW_MS;
  // KV is eventually consistent and has no atomic increment. Local enforcement
  // remains active; this adds a distributed best-effort ceiling and telemetry.
  await persistRateBucket(env,key,{count,started:windowStart,limit},120);
  return {ok:local.ok && count<=limit,limit,remaining:Math.max(0,Math.min(local.remaining,limit-count)),reset,backend:'cloudflare_kv_best_effort'};
}

export const rateLimit=localRateLimit;

export async function validateBody(request, maxBytes=MAX_BODY_BYTES){
  const length=Number(request.headers.get('content-length')||0);
  if(Number.isFinite(length) && length>maxBytes) return {ok:false,reason:'payload_too_large',max_bytes:maxBytes};
  if(request.method==='GET' || request.method==='HEAD' || request.method==='OPTIONS') return {ok:true};
  const contentType=request.headers.get('content-type')||'';
  if(!/application\/json/i.test(contentType)) return {ok:false,reason:'json_content_type_required'};
  try{
    const buf=await request.clone().arrayBuffer();
    if(buf.byteLength>maxBytes) return {ok:false,reason:'payload_too_large',max_bytes:maxBytes};
    return {ok:true,bytes:buf.byteLength};
  }catch{return {ok:false,reason:'payload_unreadable'};}
}

export function validateAIInput(payload={}){
  const query=String(payload.query||'').trim();
  if(!query) return {ok:false,status:400,reason:'query_required'};
  if(query.length>MAX_QUERY_CHARS) return {ok:false,status:413,reason:'query_too_long',max_chars:MAX_QUERY_CHARS};
  const language=String(payload.language||'hi');
  if(language.length>20) return {ok:false,status:400,reason:'invalid_language'};
  const mode=String(payload.mode||'seat');
  if(mode.length>40) return {ok:false,status:400,reason:'invalid_mode'};
  const context=payload.context;
  if(context!==undefined && (context===null || typeof context!=='object' || Array.isArray(context))) return {ok:false,status:400,reason:'invalid_context'};
  return {ok:true};
}

export function publicTrace(trace={}, env={}){
  if(String(env?.VANDIRA_DEBUG_TRACE||'').toLowerCase()==='true') return trace;
  return {
    step:trace.step,
    system:trace.system,
    primary_route:trace.primary_route,
    execution_plan:trace.execution_plan,
    mode:trace.mode,
    live_retrieval:Boolean(trace.live_retrieval),
    structured_dataset_count:trace.structured_dataset_count,
    warehouse_record_count:trace.warehouse_record_count,
    official_connector_count:trace.official_connector_count,
    discovery_count:trace.discovery_count,
    selected_sources:trace.selected_sources,
    resolved_entities:trace.resolved_entities,
    provider_status:trace.provider_status,
    answer_guard_status:trace.answer_guard_status,
    evidence_security:trace.evidence_security,
    server_time:trace.server_time
  };
}

export const API_SECURITY_LIMITS={WINDOW_MS,MAX_BODY_BYTES,MAX_AI_BODY_BYTES,MAX_QUERY_CHARS};
