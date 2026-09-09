const DAY_MS = 86400000;
const DEFAULT_DAILY_REQUESTS = 100;
const DEFAULT_DAILY_INPUT_CHARS = 1200000;
const DEFAULT_MAX_INPUT_CHARS = 24000;
const DEFAULT_MAX_OUTPUT_TOKENS = 900;

function n(v,d){ const x=Number(v); return Number.isFinite(x)&&x>0?Math.floor(x):d; }
function dayKey(){ return new Date().toISOString().slice(0,10); }
function localKey(scope){ return `budget:${scope}:${dayKey()}`; }
const local = new Map();

export function aiBudgetConfig(env={}){
  return {
    daily_requests:n(env.VANDIRA_AI_DAILY_REQUEST_LIMIT,DEFAULT_DAILY_REQUESTS),
    daily_input_chars:n(env.VANDIRA_AI_DAILY_INPUT_CHAR_BUDGET,DEFAULT_DAILY_INPUT_CHARS),
    max_input_chars:n(env.VANDIRA_AI_MAX_INPUT_CHARS,DEFAULT_MAX_INPUT_CHARS),
    max_output_tokens:n(env.VANDIRA_AI_MAX_OUTPUT_TOKENS,DEFAULT_MAX_OUTPUT_TOKENS),
    backend:env?.VANDIRA_AI_BUDGET_KV?'cloudflare_kv':'local_isolate_fallback'
  };
}

async function read(env,key){
  const kv=env?.VANDIRA_AI_BUDGET_KV;
  if(kv){ try{return await kv.get(key,'json');}catch{} }
  return local.get(key)||null;
}
async function write(env,key,value){
  const kv=env?.VANDIRA_AI_BUDGET_KV;
  if(kv){ try{await kv.put(key,JSON.stringify(value),{expirationTtl:DAY_MS/1000+3600});return 'cloudflare_kv';}catch{} }
  local.set(key,value); return 'local_isolate';
}

export async function consumeAIBudget(env={},inputChars=0){
  const cfg=aiBudgetConfig(env);
  const chars=Math.max(0,Math.floor(Number(inputChars)||0));
  if(chars>cfg.max_input_chars) return {ok:false,reason:'ai_input_budget_exceeded',status:413,config:cfg};
  const key=localKey('global');
  const prior=(await read(env,key))||{requests:0,input_chars:0};
  if(Number(prior.requests||0)>=cfg.daily_requests) return {ok:false,reason:'daily_ai_request_budget_exceeded',status:429,config:cfg,used:prior};
  if(Number(prior.input_chars||0)+chars>cfg.daily_input_chars) return {ok:false,reason:'daily_ai_input_budget_exceeded',status:429,config:cfg,used:prior};
  const next={requests:Number(prior.requests||0)+1,input_chars:Number(prior.input_chars||0)+chars};
  const backend=await write(env,key,next);
  return {ok:true,status:200,config:cfg,used:next,backend};
}

export function estimateChars(messages=[]){
  return messages.reduce((sum,m)=>sum+String(m?.content||'').length,0);
}
