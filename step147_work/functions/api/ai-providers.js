import {freeOnlyEnabled,providerAllowed,freeProviderPolicy} from '../lib/ai-provider-policy.js';

const REQUEST_TIMEOUT_MS = 12000;
const RETRYABLE = new Set([408,429,500,502,503,504]);
const json = (data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',}});

const PROVIDERS = {
  cloudflare:{env:[],modelEnv:'CF_AI_MODEL',label:'Cloudflare Workers AI',kind:'cloudflare'},
  gemini:{env:['GEMINI_API_KEY'],modelEnv:'GEMINI_MODEL',label:'Google Gemini API',kind:'gemini'},
  groq:{env:['GROQ_API_KEY'],modelEnv:'GROQ_MODEL',label:'Groq API',kind:'openai-compatible'},
  openrouter:{env:['OPENROUTER_API_KEY'],modelEnv:'OPENROUTER_MODEL',label:'OpenRouter',kind:'openai-compatible'},
  custom:{env:['AI_API_KEY','AI_BASE_URL'],modelEnv:'AI_MODEL',label:'Custom OpenAI-compatible provider',kind:'openai-compatible'}
};

export function configuredProviders(env={}){
  return Object.entries(PROVIDERS).map(([id,p])=>({
    id,label:p.label,configured:id==='cloudflare' ? Boolean(env?.AI || (env?.CF_ACCOUNT_ID && env?.CF_API_TOKEN)) : p.env.every(k=>Boolean(env?.[k])),model:env?.[p.modelEnv]||defaultModel(id),kind:p.kind
  }));
}

export function defaultModel(id){
  if(id==='cloudflare') return '@cf/openai/gpt-oss-20b';
  if(id==='gemini') return 'gemini-2.5-flash-lite';
  if(id==='groq') return 'openai/gpt-oss-20b';
  if(id==='openrouter') return 'openrouter/free';
  return 'gpt-4o-mini';
}

function extractText(d){
  return d?.choices?.[0]?.message?.content || d?.candidates?.[0]?.content?.parts?.map(x=>x.text||'').join('') || d?.response || null;
}

async function fetchWithTimeout(url,options={},timeoutMs=REQUEST_TIMEOUT_MS){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{return await fetch(url,{...options,signal:controller.signal});}
  finally{clearTimeout(timer);}
}

async function postOpenAI(base,key,model,messages,extraHeaders={},attempt=0){
  const r=await fetchWithTimeout(`${String(base).replace(/\/$/,'')}/chat/completions`,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${key}`,...extraHeaders},body:JSON.stringify({model,temperature:0.1,messages,max_tokens:900})});
  const text=await r.text(); let d=null; try{d=JSON.parse(text)}catch{}
  if(!r.ok){
    const e=new Error(`${r.status}:${d?.error?.message||text.slice(0,300)}`); e.status=r.status; e.retryAfter=r.headers.get('retry-after');
    if(attempt===0 && RETRYABLE.has(r.status)){ await new Promise(x=>setTimeout(x,Math.min(2500,Math.max(250,Number(e.retryAfter||1)*1000)))); return postOpenAI(base,key,model,messages,extraHeaders,1); }
    throw e;
  }
  return {text:extractText(d),status:r.status,usage:d?.usage||null};
}

async function callGemini(env,messages){
  const key=env.GEMINI_API_KEY; const model=env.GEMINI_MODEL||defaultModel('gemini');
  const system=messages.find(x=>x.role==='system')?.content||'';
  const contents=messages.filter(x=>x.role!=='system').map(x=>({role:x.role==='assistant'?'model':'user',parts:[{text:String(x.content)}]}));
  const u=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
  const r=await fetchWithTimeout(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents,generationConfig:{temperature:0.1,maxOutputTokens:900}})});
  const text=await r.text(); let d=null; try{d=JSON.parse(text)}catch{}
  if(!r.ok) throw new Error(`${r.status}:${d?.error?.message||text.slice(0,300)}`);
  return {text:extractText(d),status:r.status,usage:d?.usageMetadata||null};
}

async function callCloudflare(env,messages){
  const model=env.CF_AI_MODEL||defaultModel('cloudflare');
  if(env?.AI && typeof env.AI.run==='function'){
    const prompt=messages.map(x=>`${String(x.role).toUpperCase()}: ${String(x.content)}`).join('\n\n');
    const result=await env.AI.run(model,{prompt,temperature:0.1,max_tokens:900});
    return {text:extractText(result),status:200,usage:result?.usage||null};
  }
  const account=env.CF_ACCOUNT_ID; const token=env.CF_API_TOKEN;
  if(!account || !token) throw new Error('Cloudflare Workers AI binding/API credentials unavailable');
  const u=`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/ai/run/${encodeURIComponent(model)}`;
  const r=await fetchWithTimeout(u,{method:'POST',headers:{'content-type':'application/json','authorization':`Bearer ${token}`},body:JSON.stringify({messages})});
  const text=await r.text(); let d=null; try{d=JSON.parse(text)}catch{}
  if(!r.ok || d?.success===false) throw new Error(`${r.status}:${d?.errors?.[0]?.message||text.slice(0,300)}`);
  return {text:extractText(d?.result||d),status:r.status,usage:d?.result?.usage||null};
}

async function callOne(id,env,messages){
  if(id==='gemini') return callGemini(env,messages);
  if(id==='cloudflare') return callCloudflare(env,messages);
  if(id==='groq') return postOpenAI('https://api.groq.com/openai/v1',env.GROQ_API_KEY,env.GROQ_MODEL||defaultModel('groq'),messages);
  if(id==='openrouter') return postOpenAI('https://openrouter.ai/api/v1',env.OPENROUTER_API_KEY,env.OPENROUTER_MODEL||defaultModel('openrouter'),messages,{'HTTP-Referer':'https://up.topanalytica.in','X-Title':'VANDIRA UP 2027'});
  return postOpenAI(env.AI_BASE_URL,env.AI_API_KEY,env.AI_MODEL||defaultModel('custom'),messages);
}

export async function runProviderCascade(env,messages,preferred='auto'){
  const configured=configuredProviders(env);
  const baseOrder=['gemini','groq','cloudflare','openrouter','custom'];
  const requested=preferred&&preferred!=='auto' ? [preferred,...baseOrder.filter(x=>x!==preferred)] : baseOrder;
  const order=requested.filter(id=>providerAllowed(id,env));
  const attempts=[];
  for(const id of requested){
    if(!providerAllowed(id,env)){ attempts.push({provider:id,status:'blocked_by_free_only_policy'}); continue; }
    const p=PROVIDERS[id];
    if(!p || !configured.find(x=>x.id===id)?.configured){ attempts.push({provider:id,status:'not-configured'}); continue; }
    try{
      const result=await callOne(id,env,messages);
      if(result?.text) return {answer:result.text,provider:id,model:env?.[p.modelEnv]||defaultModel(id),attempts:[...attempts,{provider:id,status:'ok'}],usage:result.usage||null,policy:freeProviderPolicy(env)};
      attempts.push({provider:id,status:'empty-response'});
    }catch(e){ attempts.push({provider:id,status:'error',http_status:Number(e?.status||0)||undefined,message:String(e.message||e).slice(0,180)}); }
  }
  return {answer:null,provider:null,model:null,attempts,usage:null,policy:freeProviderPolicy(env)};
}

export function onRequestGet({env}){
  return json({step:'STEP141',providers:configuredProviders(env),recommended_order:['gemini','groq','cloudflare','openrouter'],policy:freeProviderPolicy(env),security:'API keys are server-side environment variables and are never returned.'});
}
