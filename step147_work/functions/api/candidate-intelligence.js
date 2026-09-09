import {resolveEntities} from '../lib/entity-resolver.js';
const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store',};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
const clean=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();

async function load(){
  const u=new URL('../../data/eci_assembly_2022_warehouse_step89.json',import.meta.url); return (await (await fetch(u)).json()).records||[];
}
async function form20(){
  try{const u=new URL('../../data/form20_candidate_map_2022.json',import.meta.url); return (await (await fetch(u)).json()).constituencies||{};}catch{return {}}
}
export async function onRequestGet({request}){
  const u=new URL(request.url), q=String(u.searchParams.get('q')||'').trim(), ac=Number(u.searchParams.get('ac')||0), party=clean(u.searchParams.get('party')||'');
  const rows=await load(); const f20=await form20(); let selected=rows;
  if(ac>=1&&ac<=403) selected=rows.filter(r=>r.ac_no===ac);
  else if(q) { const e=await resolveEntities(q,{},request); if(e.primary?.type==='constituency') selected=rows.filter(r=>r.ac_no===e.primary.ac_no); else selected=rows.filter(r=>[r.winner,r.runner_up,r.constituency,r.district].some(v=>clean(v).includes(clean(q)))); }
  if(party) selected=selected.filter(r=>clean(r.winner_party)===party||clean(r.runner_up_party)===party);
  const results=[];
  for(const r of selected){
    const candidates=[];
    if(r.winner) candidates.push({name:r.winner,party:r.winner_party,votes:r.winner_votes,vote_share:r.winner_vote_share,role:'winner',rank:1});
    if(r.runner_up) candidates.push({name:r.runner_up,party:r.runner_up_party,votes:r.runner_up_votes,vote_share:r.runner_up_vote_share,role:'runner_up',rank:2});
    const extras=f20[String(r.ac_no)]?.candidates||[];
    const usable=extras.filter(c=>c.name && !/^s\.?\s*no\.?$/i.test(c.name) && !/^sr\.?\s*no\.?$/i.test(c.name) && !/^s\.?$/i.test(c.name));
    results.push({ac_no:r.ac_no,constituency:r.constituency,district:r.district,election_year:2022,candidates,form20_candidate_count:usable.length,form20_candidates:usable,coverage_note:'Winner/runner-up are normalized ECI warehouse records. Form20 candidate names are additive where the source map is usable; they are not promoted to verified party/vote records without reconciliation.',provenance:{warehouse:'data/eci_assembly_2022_warehouse_step89.json',form20:'data/form20_candidate_map_2022.json',official_reference:'https://www.eci.gov.in/statistical-reports',source_tier:1}});
  }
  return json({step:'STEP93',count:results.length,results,query:q||null,ac_no:ac||null,party:party||null});
}
