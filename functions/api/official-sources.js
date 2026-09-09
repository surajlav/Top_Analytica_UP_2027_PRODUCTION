const SOURCES = {
  eci: [
    {id:'eci-assembly-election', name:'ECI Assembly Election hub', tier:1, url:'https://www.eci.gov.in/assembly-election', topics:['assembly','election','2022','UP']},
    {id:'eci-statistical-reports', name:'ECI Statistical Reports', tier:1, url:'https://www.eci.gov.in/statistical-reports', topics:['statistics','results','candidate','votes','UP']},
    {id:'eci-house-terms', name:'ECI Terms of Houses', tier:1, url:'https://www.eci.gov.in/term-of-the-houses', topics:['term','403','assembly','UP']}
  ],
  ceo: [
    {id:'ceo-up', name:'Chief Electoral Officer, Uttar Pradesh', tier:1, url:'http://ceouttarpradesh.nic.in', topics:['electoral roll','polling station','assembly','UP']}
  ],
  assembly: [
    {id:'up-assembly-search', name:'UP Legislative Assembly Proceedings Search', tier:1, url:'https://www.upvidhansabhaproceedings.gov.in/search', topics:['questions','discussions','bills','proceedings','members']}
  ],
  government: [
    {id:'up-cabinet', name:'UP Government Cabinet Decisions', tier:1, url:'https://www.information.up.gov.in/en/hi_cabinet-decision-new.aspx', topics:['cabinet','government','policy']},
    {id:'up-cm-releases', name:'UP Government CM Press Releases', tier:1, url:'https://information.up.gov.in/cm_press_release_details.aspx', topics:['CM','government','district','announcement']}
  ]
};

const strip = (s='') => String(s).replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#x27;/g,"'").replace(/\s+/g,' ').trim();
const abs = (href, base) => { try { return new URL(href, base).toString(); } catch { return ''; } };
function parseLinks(html, base){
  const out=[];
  for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){
    const url=abs(m[1],base), title=strip(m[2]);
    if(url && title) out.push({title,url});
  }
  const seen=new Set();
  return out.filter(x=>{if(seen.has(x.url))return false;seen.add(x.url);return true;}).slice(0,80);
}
async function fetchPage(url){
  const r=await fetch(url,{headers:{'user-agent':'VANDIRA-UP-2027/STEP86 OfficialConnector/1.0','accept':'text/html,application/xhtml+xml'}});
  if(!r.ok) throw new Error(`HTTP ${r.status}`);
  return {html:await r.text(),status:r.status};
}
function score(item, query){
  const q=String(query||'').toLowerCase();
  const text=`${item.title} ${item.url}`.toLowerCase();
  const terms=['uttar pradesh','up','assembly','election','2022','2024','statistical','result','question','bill','cabinet','government','chief minister','press release'];
  let s=0; for(const t of terms) if(text.includes(t)) s+=2;
  for(const token of q.split(/\s+/).filter(Boolean)) if(token.length>2&&text.includes(token)) s+=1;
  return s;
}

export async function onRequestGet({request}){
  const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store',};
  const u=new URL(request.url);
  const topic=(u.searchParams.get('topic')||'all').toLowerCase();
  const query=(u.searchParams.get('q')||'').trim();
  const groups=topic==='all'?Object.values(SOURCES).flat():(SOURCES[topic]||[]);
  const results=[];
  for(const source of groups){
    try{
      const page=await fetchPage(source.url);
      const links=parseLinks(page.html,source.url).map(x=>({...x,source_id:source.id,source:source.name,tier:source.tier,topics:source.topics,live:true}));
      results.push({source:{...source,ok:true,status:page.status},links:links.sort((a,b)=>score(b,query)-score(a,query)).slice(0,30)});
    }catch(error){
      results.push({source:{...source,ok:false,status:0,error:String(error.message||error)},links:[]});
    }
  }
  const flat=results.flatMap(x=>x.links);
  flat.sort((a,b)=>score(b,query)-score(a,query));
  return new Response(JSON.stringify({step:'STEP86',retrieved_at:new Date().toISOString(),topic,query,source_groups:results,links:flat.slice(0,50),policy:'Official-source discovery only; canonical local datasets remain read-only.'}),{headers});
}
