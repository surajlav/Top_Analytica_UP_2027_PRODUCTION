const clean = (s='') => String(s).toLowerCase().normalize('NFKC').replace(/[\u2000-\u206F\u2E00-\u2E7F'"`]/g,' ').replace(/[^\p{L}\p{N}\p{M}\s.-]/gu,' ').replace(/\s+/g,' ').trim();

const ALIASES = new Map([
  ['lucknow north','Lucknow North'],['lucknow uttar','Lucknow North'],['lucknow north','Lucknow North'],['लखनऊ उत्तर','Lucknow North'],['लखनऊ उत्तरी','Lucknow North'],['लखनऊ नॉर्थ','Lucknow North'],
  ['lucknow south','Lucknow South'],['लखनऊ दक्षिण','Lucknow South'],['lucknow central','Lucknow Central'],['लखनऊ सेंट्रल','Lucknow Central'],['लखनऊ मध्य','Lucknow Central'],
  ['noida','Noida'],['नोएडा','Noida'],['agra north','Agra North'],['आगरा उत्तर','Agra North'],['वाराणसी उत्तर','Varanasi North']
]);

async function records(request){
  const url = new URL('/data/eci_assembly_2022_warehouse_step89.json', request.url);
  const r=await fetch(url,{cache:'no-store'});
  if(!r.ok) throw new Error(`warehouse_http_${r.status}`);
  return r.json();
}

export async function loadEntityIndex(request){
  const d=await records(request); const index=[];
  for(const r of d.records||[]){
    const names=[r.constituency, `${r.ac_no} ${r.constituency}`].filter(Boolean);
    index.push({type:'constituency',id:`UP-AC-${String(r.ac_no).padStart(3,'0')}`,ac_no:r.ac_no,name:r.constituency,district:r.district,keys:names.map(clean)});
    for(const c of [r.winner,r.runner_up]) if(c) index.push({type:'candidate',id:`UP-AC-${r.ac_no}-${clean(c).replace(/\s+/g,'-')}`,name:c,ac_no:r.ac_no,constituency:r.constituency,district:r.district,keys:[c,`${c} ${r.constituency}`].map(clean)});
  }
  return index;
}

export async function resolveEntities(query, context={}, request){
  if(!request) throw new Error('request_required');
  const q=clean(query); const idx=await loadEntityIndex(request); const hits=[];
  const ac=Number(context.ac_no||context.acNo||0);
  if(Number.isInteger(ac)&&ac>=1&&ac<=403){ const x=idx.find(i=>i.type==='constituency'&&i.ac_no===ac); if(x) hits.push({...x,match:'context.ac_no',score:1}); }
  for(const [alias,canonical] of ALIASES){ if(q.includes(clean(alias))){ const x=idx.find(i=>i.type==='constituency'&&clean(i.name)===clean(canonical)); if(x) hits.push({...x,match:'alias',score:.98}); }}
  // Numeric constituency references are intentionally strict: accept only an explicit AC marker
  // or a standalone 1..403 token, avoiding accidental matches inside candidate names.
  const acMatch=q.match(/(?:ac|assembly|विधानसभा|मतदारसंघ|निर्वाचन क्षेत्र)\s*[-#:]?\s*(\d{1,3})\b/i) || q.match(/\b(\d{1,3})\s*(?:विधानसभा|मतदारसंघ|assembly|seat)/i);
  const bareAc=q.match(/^(\d{1,3})$/);
  const numericAc=Number(acMatch?.[1]||bareAc?.[1]||0);
  if(numericAc>=1&&numericAc<=403){
    const x=idx.find(i=>i.type==='constituency'&&Number(i.ac_no)===numericAc);
    if(x) hits.push({...x,match:'numeric_ac',score:.99});
  }
  for(const x of idx){
    if(x.keys.some(k=>k && (q===k || q.includes(k)))) hits.push({...x,match:'text',score:x.type==='constituency'?.95:.9});
  }
  const uniq=[...new Map(hits.map(h=>[h.id,h])).values()].sort((a,b)=>b.score-a.score);
  return {query,entities:uniq.slice(0,10),primary:uniq[0]||null,confidence:uniq[0]?.score>=.95?'high':uniq[0]?.score>=.9?'medium':'low'};
}
