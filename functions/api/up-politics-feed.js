const FEEDS = [
  {
    name: 'Indian Express — Political Pulse',
    url: 'https://indianexpress.com/section/political-pulse/feed/',
    source_url: 'https://indianexpress.com/section/political-pulse/',
    type: 'news'
  }
];

const UP_TERMS = /\b(uttar pradesh|up politics|up assembly|lucknow|yogi|adityanath|akhilesh|samajwadi|samajwadi party|mayawati|bjp|bsp|congress|rld|pda|vidhan sabha|uttar-pradesh)\b/i;
const safeId = (s='') => String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,36);
const strip = (s='') => String(s).replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
const tag = (xml, name) => { const m=xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`,'i')); return m?strip(m[1]):''; };

export async function onRequestGet(context) {
  const headers = {'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=300, s-maxage=300',};
  try {
    const all=[];
    for (const feed of FEEDS) {
      const res=await fetch(feed.url,{headers:{'user-agent':'VANDIRA-UP-Politics/1.0'}});
      if(!res.ok) continue;
      const xml=await res.text();
      const items=[...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(m=>m[1]);
      for(const item of items){
        const title=tag(item,'title'), link=tag(item,'link'), desc=tag(item,'description'), pub=tag(item,'pubDate'), text=`${title} ${desc}`;
        if(!UP_TERMS.test(text)) continue;
        all.push({id:`rss-${safeId(link||title)}`,published_at:pub||new Date().toISOString(),headline:title,summary:desc,category:'Current Politics',source:feed.name,source_url:link||feed.source_url,source_type:feed.type,confidence:'reported'});
      }
    }
    all.sort((a,b)=>new Date(b.published_at)-new Date(a.published_at));
    return new Response(JSON.stringify({dataset:'VANDIRA UP Politics Live Feed',mode:'server-live',fetched_at:new Date().toISOString(),items:all.slice(0,12),sources:FEEDS}),{headers});
  } catch (e) {
    return new Response(JSON.stringify({dataset:'VANDIRA UP Politics Live Feed',mode:'error',fetched_at:new Date().toISOString(),items:[],error:'Source fetch failed'}),{status:502,headers});
  }
}
