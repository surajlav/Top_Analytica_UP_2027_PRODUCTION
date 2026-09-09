/* STEP98 — VANDIRA Personal Political Context
   Local-first, user-controlled consultant context. Never reads or sends profile PII. */
(function(){
  const KEY='vandiraPersonalContextV1';
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim().slice(0,600);
  const list=v=>Array.isArray(v)?v.map(clean).filter(Boolean).slice(0,12):[];
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
  function normalize(x={}){return {version:'step98.1',objective:clean(x.objective),focus_areas:list(x.focus_areas),pinned_entities:Array.isArray(x.pinned_entities)?x.pinned_entities.slice(0,12):[],working_notes:list(x.working_notes),established_facts:list(x.established_facts),pending_questions:list(x.pending_questions),preferences:{response_depth:['concise','standard','deep'].includes(x?.preferences?.response_depth)?x.preferences.response_depth:'standard',language:clean(x?.preferences?.language,20)||'hi'},updated_at:x.updated_at||null}}
  function save(x){const v=normalize({...x,updated_at:new Date().toISOString()});try{localStorage.setItem(KEY,JSON.stringify(v));window.dispatchEvent(new CustomEvent('vandira-context-updated',{detail:v}));}catch(e){}return v}
  function runtime(extra={}){return {selected_ac_no:Number(extra.selected_ac_no||0)||null,last_route:clean(extra.last_route,100)||null,last_entity:extra.last_entity||null,recent_turns:Array.isArray(extra.recent_turns)?extra.recent_turns.slice(-6).map(t=>({role:t.role==='assistant'?'assistant':'user',text:clean(t.text,900)})).filter(t=>t.text):[]}}
  window.VandiraPersonalContext={KEY,read,save,normalize,runtime,clear:()=>save({})};
})();
