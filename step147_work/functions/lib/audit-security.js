const SAFE_METHODS = new Set(['GET','HEAD','OPTIONS']);
const MAX_EVENTS = 100;

function clean(value, max=240){
  return String(value ?? '').replace(/[\r\n\t]+/g,' ').trim().slice(0,max);
}

export function securityHeaders(extra={}){
  return {
    'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store, no-cache, must-revalidate, max-age=0',
    'X-Content-Type-Options':'nosniff',
    'X-Frame-Options':'DENY',
    'Referrer-Policy':'strict-origin-when-cross-origin',
    'Permissions-Policy':'camera=(), geolocation=(), microphone=(self)',
    'Content-Security-Policy':"default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'",
    ...extra
  };
}

export function auditEvent(input={}){
  const method=clean(input.method||'GET',16).toUpperCase();
  const route=clean(input.route||'unknown',160);
  const status=Number(input.status||0);
  const durationMs=Math.max(0,Math.round(Number(input.durationMs||0)));
  const severity=status>=500?'high':status>=400?'medium':'info';
  return {
    timestamp:new Date().toISOString(), method, route,
    status:Number.isFinite(status)?status:0,
    duration_ms:durationMs,
    severity,
    safe_method:SAFE_METHODS.has(method),
    request_id:clean(input.requestId||crypto.randomUUID(),80),
    source:clean(input.source||'vandira-runtime',80)
  };
}

export function summarizeAudit(events=[]){
  const list=Array.isArray(events)?events.slice(-MAX_EVENTS):[];
  const failures=list.filter(e=>Number(e?.status)>=400).length;
  const serverErrors=list.filter(e=>Number(e?.status)>=500).length;
  const unsafe=list.filter(e=>e?.safe_method===false).length;
  const durations=list.map(e=>Number(e?.duration_ms)).filter(Number.isFinite);
  const avg=durations.length?Math.round(durations.reduce((a,b)=>a+b,0)/durations.length):0;
  return {
    window_events:list.length,
    failures, server_errors:serverErrors, unsafe_method_events:unsafe,
    average_duration_ms:avg,
    audit_mode:'local_event_summary',
    immutable_source_of_truth:'not_claimed',
    note:'This layer records runtime audit metadata; it does not claim tamper-proof storage without a configured durable audit backend.'
  };
}
