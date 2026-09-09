const ROOTS = [
  {id:'eci-statistical-reports', name:'ECI Statistical Reports', url:'https://www.eci.gov.in/statistical-reports', tier:1},
  {id:'eci-index-card', name:'ECI Index Card & Statistical Reporting', url:'https://www.eci.gov.in/index-card-statistical-reporting', tier:1}
];
const YEARS=[2022,2017,2012,2007,2002,1996,1993,1991,1989,1985,1980,1977,1974,1969,1967,1962,1957,1951];
const strip=s=>String(s||'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&#x27;/g,"'").replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const abs=(href,base)=>{try{return new URL(href,base).toString()}catch{return ''}};
const kind=u=>{const x=String(u).toLowerCase(); if(/\.pdf(?:\?|$)/.test(x))return 'pdf'; if(/\.(xls|xlsx|csv)(?:\?|$)/.test(x))return 'spreadsheet'; if(/statistical-report|index-card|result/.test(x))return 'statistical-report'; return 'html'};
function links(html,base){
  const out=[];
  for(const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){
    const url=abs(m[1],base), title=strip(m[2]);
    if(url&&title) out.push({title,url,resource_kind:kind(url)});
  }
  const seen=new Set(); return out.filter(x=>{if(seen.has(x.url))return false;seen.add(x.url);return true;});
}
async function get(url){
  const r=await fetch(url,{headers:{'user-agent':'VANDIRA-UP-2027/STEP88-ElectionIngest/1.0','accept':'text/html,application/xhtml+xml,application/pdf,*/*'}});
  const text=await r.text();
  return {ok:r.ok,status:r.status,text,content_type:r.headers.get('content-type')||''};
}
function yearMatch(text,year){return new RegExp(`(?:^|[^0-9])${year}(?:[^0-9]|$)`,'i').test(text)}
function score(x,year){
  const t=`${x.title} ${x.url}`.toLowerCase(); let s=0;
  if(t.includes('uttar pradesh'))s+=8; if(t.includes('assembly'))s+=4; if(t.includes('election'))s+=3; if(year&&t.includes(String(year)))s+=6;
  if(/statistical|index|result|candidate|vote|elector|constituency/.test(t))s+=2;
  return s;
}
function normalize(items,year){
  const now=new Date().toISOString(), seen=new Set();
  return items.sort((a,b)=>score(b,year)-score(a,year)).filter(x=>{if(seen.has(x.url))return false;seen.add(x.url);return true}).slice(0,80).map(x=>({
    election_year:year||null,
    state:'Uttar Pradesh',
    election_type:'Assembly',
    resource_title:x.title,
    resource_url:x.url,
    resource_kind:x.resource_kind,
    source_name:'Election Commission of India',
    source_tier:1,
    discovered_at:now,
    retrieved_at:now,
    published_at:null,
    content_hash:null,
    record_count:null,
    status:'discovered',
    data_quality_flags:[]
  }));
}
export async function onRequestGet({request}){
  const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store',};
  const u=new URL(request.url); const yearRaw=u.searchParams.get('year'); const year=yearRaw?Number(yearRaw):2022;
  if(!YEARS.includes(year)) return new Response(JSON.stringify({error:'unsupported_year',supported_years:YEARS}),{status:400,headers});
  const all=[]; const rootStatus=[];
  for(const root of ROOTS){
    try{
      const r=await get(root.url); rootStatus.push({id:root.id,url:root.url,ok:r.ok,status:r.status});
      if(r.ok){
        for(const x of links(r.text,root.url)){
          const hay=`${x.title} ${x.url}`;
          if(/uttar pradesh/i.test(hay)||yearMatch(hay,year)||/assembly election|statistical report|index card|result/i.test(hay)) all.push({...x,root:root.id});
        }
      }
    }catch(e){rootStatus.push({id:root.id,url:root.url,ok:false,status:0,error:String(e.message||e)})}
  }
  const resources=normalize(all,year);
  return new Response(JSON.stringify({step:'STEP88',retrieved_at:new Date().toISOString(),state:'Uttar Pradesh',election_type:'Assembly',election_year:year,root_status:rootStatus,resource_count:resources.length,resources,policy:'Official ECI discovery and normalization only; canonical local election and booth JSON remains read-only.'}),{headers});
}
