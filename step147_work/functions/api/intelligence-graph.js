const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store',};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
async function load(request){const u=new URL('/data/vandira_intelligence_graph_step94.json',request.url);const r=await fetch(u,{headers:{'cache-control':'no-store'}});if(!r.ok)throw new Error(`graph HTTP ${r.status}`);return r.json();}
export async function onRequestGet({request}){
 try{
  const u=new URL(request.url), q=String(u.searchParams.get('q')||'').trim().toLowerCase(), type=String(u.searchParams.get('type')||'').trim(), ac=Number(u.searchParams.get('ac')||0), depth=Math.min(2,Math.max(0,Number(u.searchParams.get('depth')||1)));
  const g=await load(request);
  if(u.searchParams.get('summary')==='1') return json({step:'STEP94',coverage:g.coverage,node_types:g.node_types,edge_types:g.edge_types});
  let matches=g.nodes.filter(n=>(!type||n.type===type)&&(!ac||Number(n.properties?.ac_no)===ac)&&(!q||`${n.label} ${JSON.stringify(n.properties)}`.toLowerCase().includes(q)));
  if(!matches.length) return json({step:'STEP94',count:0,results:[],query:q||null});
  const ids=new Set(matches.map(n=>n.id)), frontier=new Set(ids), seen=new Set(ids);
  const edges=g.edges;
  for(let d=0;d<depth;d++){
   const next=new Set(); for(const e of edges){if(frontier.has(e.source)){next.add(e.target)} if(frontier.has(e.target)){next.add(e.source)}}
   for(const x of next)seen.add(x); frontier=next;
  }
  const results=g.nodes.filter(n=>seen.has(n.id));
  const rel=edges.filter(e=>seen.has(e.source)&&seen.has(e.target));
  return json({step:'STEP94',query:q||null,match_count:matches.length,node_count:results.length,edge_count:rel.length,matches,results,edges:rel});
 }catch(e){return json({step:'STEP94',ok:false,error:String(e?.message||e)},500)}
}