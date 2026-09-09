import { auditEvent, summarizeAudit, securityHeaders } from '../lib/audit-security.js';

export async function onRequestGet({request, env}){
  const started=Date.now();
  const url=new URL(request.url);
  const events=[];
  events.push(auditEvent({method:'GET',route:url.pathname,status:200,durationMs:Date.now()-started,requestId:request.headers.get('CF-Request-ID')||undefined}));
  const durableAuditConfigured=Boolean(env?.VANDIRA_AUDIT_KV);
  return new Response(JSON.stringify({
    ok:true,
    contract_version:'step116',
    security:{
      security_headers:'enabled',
      cache_policy:'no-store',
      durable_audit_backend:durableAuditConfigured?'configured':'not_configured',
      secret_exposure_policy:'server-side only; never expose provider secrets to browser',
      input_policy:'bounded and sanitized',
      pii_policy:'no profile PII or sensitive voter attributes in audit events'
    },
    audit:summarizeAudit(events),
    provenance:{layer:'L6 Audit & Provenance',source:'VANDIRA runtime',verified_at:new Date().toISOString()}
  }),{status:200,headers:securityHeaders()});
}

export async function onRequestPost({request, env}){
  const started=Date.now();
  let body={};
  try{ body=await request.json(); }catch{}
  const event=auditEvent({
    method:request.method, route:body.route||'/api/audit-security',
    status:body.status||200, durationMs:body.duration_ms||Date.now()-started,
    requestId:request.headers.get('CF-Request-ID')||undefined,
    source:body.source||'client-runtime'
  });
  if(env?.VANDIRA_AUDIT_KV){
    const key=`audit:${Date.now()}:${event.request_id}`;
    await env.VANDIRA_AUDIT_KV.put(key,JSON.stringify(event),{expirationTtl:60*60*24*30});
  }
  return new Response(JSON.stringify({ok:true,event,durable_stored:Boolean(env?.VANDIRA_AUDIT_KV)}),{status:202,headers:securityHeaders()});
}
