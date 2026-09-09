const BASE = 'https://results.eci.gov.in/ResultAcGenMar2022/hi/';
const clean = (s='') => String(s).replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;|&#x27;/gi,"'").replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/<br\s*\/?>(\s*)/gi,' ').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const cells = row => [...String(row).matchAll(/<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map(m=>clean(m[1]));
const num = s => { const x=String(s||'').replace(/,/g,'').replace(/%/g,'').trim(); const n=Number(x); return Number.isFinite(n)?n:null; };
const acCode = ac => String(Number(ac)).padStart(1,'0');
const headerNorm=s=>String(s||'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');

function detectColumns(rows){
  const aliases={candidate:['candidate','उम्मीदवार','name'],party:['party','पार्टी'],evm:['evm','ईवीएम'],postal:['postal','डाक'],total:['total','कुल'],share:['vote share','voteshare','मतप्रतिशत','प्रतिशत']};
  let best=null;
  for(const row of rows.slice(0,12)){
    const norm=row.map(headerNorm); const idx={};
    for(const [k,als] of Object.entries(aliases)) idx[k]=norm.findIndex(x=>als.some(a=>x.includes(headerNorm(a))));
    const score=Object.values(idx).filter(v=>v>=0).length;
    if(score>(best?.score||0)) best={score,idx,header:row};
  }
  return best&&best.score>=3?best:null;
}

function parseCandidates(html){
  const rows=[...String(html).matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(m=>cells(m[1])).filter(r=>r.length>=5);
  const detected=detectColumns(rows); const out=[];
  if(detected){
    const start=rows.indexOf(detected.header)+1;
    for(const r of rows.slice(Math.max(0,start))){
      const rank=num(r[0]);
      if(rank===null || rank<1 || rank>100) continue;
      const candidate=detected.idx.candidate>=0?r[detected.idx.candidate]:r[1];
      const party=detected.idx.party>=0?r[detected.idx.party]:r[2];
      const total=detected.idx.total>=0?num(r[detected.idx.total]):num(r[5]);
      const evm=detected.idx.evm>=0?num(r[detected.idx.evm]):num(r[3]);
      const postal=detected.idx.postal>=0?num(r[detected.idx.postal]):num(r[4]);
      const share=detected.idx.share>=0?num(r[detected.idx.share]):num(r[6]);
      if(!candidate || !party || (total===null && evm===null)) continue;
      out.push({rank:out.length+1,candidate_name:candidate,party,evm_votes:evm,postal_votes:postal,total_votes:total,vote_share_pct:share});
    }
  }
  if(!out){
    for(const r of rows){
      if(!/^\d+$/.test(String(r[0]||'').trim())) continue;
      const candidate=r[1],party=r[2],evm=num(r[3]),postal=num(r[4]),total=num(r[5]),share=num(r[6]);
      if(!candidate||!party||(total===null&&evm===null)) continue;
      out.push({rank:out.length+1,candidate_name:candidate,party,evm_votes:evm,postal_votes:postal,total_votes:total,vote_share_pct:share});
    }
  }
  return {candidates:out,table_detected:Boolean(detected),header:detected?.header||null};
}

function validateCandidates(candidates){
  const issues=[];
  if(!candidates.length) issues.push('no_candidate_rows');
  const ranks=candidates.map(x=>x.rank);
  if(new Set(ranks).size!==ranks.length) issues.push('duplicate_rank');
  for(const c of candidates){
    if(c.total_votes!==null && c.evm_votes!==null && c.postal_votes!==null && c.evm_votes+c.postal_votes!==c.total_votes) issues.push(`vote_sum_mismatch:${c.rank}`);
    if(c.vote_share_pct!==null && (c.vote_share_pct<0||c.vote_share_pct>100)) issues.push(`invalid_share:${c.rank}`);
  }
  if(candidates.length && candidates[0].total_votes!==null){
    for(let i=1;i<candidates.length;i++) if(candidates[i].total_votes!==null && candidates[i].total_votes>candidates[i-1].total_votes) issues.push('ranking_not_descending');
  }
  return {valid:issues.length===0,issues};
}

export async function fetchEciResult(ac){
  const n=Number(ac); if(!Number.isInteger(n)||n<1||n>403) return {ok:false,error:'invalid_ac'};
  const url=`${BASE}ConstituencywiseS24${acCode(n)}.htm?ac=${n}`;
  try{
    const r=await fetch(url,{headers:{'user-agent':'VANDIRA-UP-2027/STEP90-ECI-Parser/1.1','accept':'text/html,application/xhtml+xml'}});
    const html=await r.text(); if(!r.ok) return {ok:false,status:r.status,url,error:`HTTP ${r.status}`};
    const parsed=parseCandidates(html); const validation=validateCandidates(parsed.candidates);
    return {ok:true,status:r.status,url,ac_no:n,candidates:parsed.candidates,meta:{page_title:(clean(html).match(/GEN(?:ERAL)?\s+ELECTION[^.]{0,160}/i)||[])[0]||null},retrieved_at:new Date().toISOString(),parser:'STEP90-schema-detect-v1',table_detected:parsed.table_detected,detected_header:parsed.header,validation,parse_warning:parsed.candidates.length?null:'No candidate rows matched expected table structure'};
  }catch(e){return {ok:false,status:0,url,error:String(e.message||e)};}
}

export async function onRequestGet({request}){
  const u=new URL(request.url); const ac=Number(u.searchParams.get('ac')); const data=await fetchEciResult(ac);
  return new Response(JSON.stringify({step:'STEP90',source:'Election Commission of India result portal',...data}),{status:data.ok?200:502,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',}});
}
