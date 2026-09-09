import fs from 'node:fs';
import path from 'node:path';
import { classifyQuery } from '../functions/lib/vandira-os.js';

const root=process.cwd();
const {spawnSync}=await import('node:child_process');
const canonical=['data/assembly_canonical_master.json','data/assembly_2022_master.json'];
const expected={
 'Who won Lucknow Central?':'election_results',
 'Compare BJP and SP in Lucknow Central':'competitive_intelligence',
 'भाजपा और सपा की तुलना करें':'party_alliance',
 'Compare two districts':'competitive_intelligence',
 '2022 में लखनऊ उत्तर का परिणाम क्या था?':'election_results',
 'लखनऊ उत्तर के उम्मीदवार कौन थे?':'candidate_intelligence',
 'Which seats are close fights?':'competitive_intelligence',
 'Election day intelligence':'election_day_intelligence',
 'मतदान टक्केवारी':'election_day_intelligence',
 'Give me a campaign plan for Lucknow North':'campaign_planning',
 'Create a press note about unemployment':'content_studio',
 'How is the government performing?':'government_policy',
 'What bills were discussed in assembly?':'assembly_proceedings',
 'What changed today in UP politics?':'executive_leadership_briefing'
};
const results=[];
for(const [q,want] of Object.entries(expected)){
 const got=classifyQuery(q).primary_route;
 results.push({type:'routing',query:q,expected:want,actual:got,pass:got===want});
}
for(const f of canonical){
 const b=fs.readFileSync(path.join(root,f));
 results.push({type:'canonical_parse',file:f,pass:JSON.parse(b.toString())!==null,bytes:b.length});
}
const allJson=[];
function walk(d){for(const n of fs.readdirSync(d,{withFileTypes:true})){if(['.git','node_modules'].includes(n.name))continue;const p=path.join(d,n.name);if(n.isDirectory())walk(p);else if(n.name.endsWith('.json'))allJson.push(p)}}
walk(path.join(root,'data'));
let jsonPass=0;for(const f of allJson){try{JSON.parse(fs.readFileSync(f,'utf8'));jsonPass++}catch(e){results.push({type:'json_parse',file:f,pass:false,error:String(e.message)})}}
const htmlFiles=[];
function walkHtml(d){for(const n of fs.readdirSync(d,{withFileTypes:true})){if(['.git','node_modules'].includes(n.name))continue;const p=path.join(d,n.name);if(n.isDirectory())walkHtml(p);else if(n.name.endsWith('.html'))htmlFiles.push(p)}}
walkHtml(root);
const htmlChecks=[];
for(const f of htmlFiles){const s=fs.readFileSync(f,'utf8');const opens=(s.match(/<script\b/gi)||[]).length;const closes=(s.match(/<\/script>/gi)||[]).length;htmlChecks.push({file:f.replace(root+path.sep,''),script_tags:opens===closes});}
const htmlTagFailures=htmlChecks.filter(x=>!x.script_tags).length;
const inline=[];
for(const f of htmlFiles){const s=fs.readFileSync(f,'utf8');let i=0;for(const m of s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)){const code=m[1].trim();if(!code)continue;const tmp=path.join('/tmp',`vandira-html-${process.pid}-${i++}.js`);fs.writeFileSync(tmp,code);const r=spawnSync(process.execPath,['--check',tmp],{encoding:'utf8'});if(r.status!==0)inline.push({file:f.replace(root+path.sep,''),error:(r.stderr||r.stdout).slice(0,500)});try{fs.unlinkSync(tmp)}catch{}}}
const js=[];
function walkJs(d){for(const n of fs.readdirSync(d,{withFileTypes:true})){if(['.git','node_modules'].includes(n.name))continue;const p=path.join(d,n.name);if(n.isDirectory())walkJs(p);else if(n.name.endsWith('.js'))js.push(p)}}
walkJs(root);
let jsPass=0;for(const f of js){const r=spawnSync(process.execPath,['--experimental-default-type=module','--check',f],{encoding:'utf8'});if(r.status===0)jsPass++;else results.push({type:'js_syntax',file:f,pass:false,error:(r.stderr||r.stdout).slice(0,500)})}
const routingPass=results.filter(x=>x.type==='routing').every(x=>x.pass);
const jsonFailures=allJson.length-jsonPass;
const jsFailures=js.length-jsPass;
const report={step:'STEP121',title:'VANDIRA Full System QA',timestamp:new Date().toISOString(),summary:{routing_cases:Object.keys(expected).length,routing_pass:Object.values(expected).filter((_,i)=>results.filter(x=>x.type==='routing')[i].pass).length,json_files:allJson.length,json_pass:jsonPass,json_fail:jsonFailures,js_files:js.length,js_pass:jsPass,js_fail:jsFailures,html_pages:htmlFiles.length,html_script_tag_failures:htmlTagFailures,html_inline_js_checked:htmlFiles.length,html_inline_js_failures:inline.length},gates:{routing: routingPass,json:jsonFailures===0,js_syntax:jsFailures===0,html_structure:htmlTagFailures===0,html_inline_js:inline.length===0},results:[...results,{type:'html_script_structure',pass:htmlTagFailures===0,failures:htmlChecks.filter(x=>!x.script_tags)},{type:'html_inline_js',pass:inline.length===0,failures:inline}]};
fs.writeFileSync('data/vandira_step121_qa_report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report.summary));
if(!routingPass||jsonFailures||jsFailures||htmlTagFailures||inline.length) process.exit(1);
