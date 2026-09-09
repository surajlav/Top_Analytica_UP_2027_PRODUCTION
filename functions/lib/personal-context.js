const MAX_TEXT=600;
const MAX_LIST=12;
const clean=(v,max=MAX_TEXT)=>String(v??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,' ').replace(/\s+/g,' ').trim().slice(0,max);
const list=(v)=>Array.isArray(v)?v.map(x=>clean(x)).filter(Boolean).slice(0,MAX_LIST):[];

export function sanitizePersonalContext(input={}){
  const x=input&&typeof input==='object'?input:{};
  return {
    version:'step98.1',
    mode:'user-controlled-local-context',
    objective:clean(x.objective),
    focus_areas:list(x.focus_areas),
    pinned_entities:Array.isArray(x.pinned_entities)?x.pinned_entities.slice(0,MAX_LIST).map(e=>({
      type:clean(e?.type,80),id:clean(e?.id,120),name:clean(e?.name,180),ac_no:Number.isInteger(Number(e?.ac_no))?Number(e.ac_no):null
    })).filter(e=>e.name||e.id):[],
    working_notes:list(x.working_notes),
    established_facts:list(x.established_facts),
    pending_questions:list(x.pending_questions),
    preferences:{
      response_depth:['concise','standard','deep'].includes(x?.preferences?.response_depth)?x.preferences.response_depth:'standard',
      language:clean(x?.preferences?.language,20)||'hi'
    },
    updated_at:clean(x.updated_at,40)||null
  };
}

export function buildConversationContext(turns=[]){
  const safe=Array.isArray(turns)?turns.slice(-6):[];
  return safe.map(t=>({role:t?.role==='assistant'?'assistant':'user',text:clean(t?.text,900)})).filter(x=>x.text);
}

export function mergeConsultantContext(saved={}, runtime={}){
  const p=sanitizePersonalContext(saved);
  const r=runtime&&typeof runtime==='object'?runtime:{};
  return {
    ...p,
    runtime:{
      selected_ac_no:Number.isInteger(Number(r.selected_ac_no))?Number(r.selected_ac_no):null,
      last_route:clean(r.last_route,100)||null,
      last_entity: r.last_entity?{type:clean(r.last_entity.type,80),name:clean(r.last_entity.name,180),ac_no:Number.isInteger(Number(r.last_entity.ac_no))?Number(r.last_entity.ac_no):null}:null,
      recent_turns:buildConversationContext(r.recent_turns)
    }
  };
}
