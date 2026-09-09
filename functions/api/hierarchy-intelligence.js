const H={'content-type':'application/json; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate','pragma':'no-cache'};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:H});
const REGIONS={
 'Agra':['Agra','Firozabad','Mainpuri','Mathura'],
 'Aligarh':['Aligarh','Etah','Hathras','Kasganj'],
 'Ayodhya':['Ambedkar Nagar','Amethi','Ayodhya','Barabanki','Sultanpur'],
 'Azamgarh':['Azamgarh','Ballia','Mau'],
 'Bareilly':['Bareilly','Budaun','Pilibhit','Shahjahanpur'],
 'Basti':['Basti','Sant Kabir Nagar','Siddharthnagar'],
 'Chitrakoot':['Banda','Chitrakoot','Hamirpur','Mahoba'],
 'Devipatan':['Bahraich','Balrampur','Gonda','Shrawasti'],
 'Gorakhpur':['Deoria','Gorakhpur','Kushinagar','Maharajganj'],
 'Jhansi':['Jalaun','Jhansi','Lalitpur'],
 'Kanpur':['Auraiya','Etawah','Farrukhabad','Kannauj','Kanpur Dehat','Kanpur Nagar'],
 'Lucknow':['Hardoi','Lakhimpur Kheri','Lucknow','Raebareli','Sitapur','Unnao'],
 'Meerut':['Baghpat','Bulandshahr','Gautam Buddha Nagar','Ghaziabad','Hapur','Meerut'],
 'Moradabad':['Amroha','Bijnor','Moradabad','Rampur','Sambhal'],
 'Prayagraj':['Fatehpur','Kaushambi','Pratapgarh','Prayagraj'],
 'Saharanpur':['Muzaffarnagar','Saharanpur','Shamli'],
 'Varanasi':['Chandauli','Ghazipur','Jaunpur','Varanasi'],
 'Mirzapur':['Bhadohi','Mirzapur','Sonbhadra']
};
const regionOf={}; Object.entries(REGIONS).forEach(([r,ds])=>ds.forEach(d=>regionOf[d]=r));
async function loadJSON(url){try{const r=await fetch(url,{headers:{'user-agent':'VANDIRA-UP-2027/STEP112'}});if(!r.ok)return null;return await r.json()}catch{return null}}
async function loadAllBooths(origin){const files=['001_050','051_100','101_150','151_200','201_250','251_300','301_350','351_400','401_403'];const out={};const chunks=await Promise.all(files.map(f=>loadJSON(`${origin}/data/booth_ac_${f}.json`)));for(const x of chunks){if(x?.constituencies)Object.assign(out,x.constituencies)}return out}
function sum(rows){return {assemblies:rows.length,booths:rows.reduce((a,x)=>a+(Number(x.booth_count)||0),0),winner_votes:rows.reduce((a,x)=>a+(Number(x.winner_votes)||0),0),turnout_avg:rows.length?+(rows.reduce((a,x)=>a+(Number(x.turnout_pct)||0),0)/rows.length).toFixed(2):null};}
export async function onRequestGet({request,env}){
 const u=new URL(request.url), level=(u.searchParams.get('level')||'state').toLowerCase(), ac=Number(u.searchParams.get('ac')||0)||null, q=(u.searchParams.get('q')||'').trim().toLowerCase(), region=(u.searchParams.get('region')||'').trim(), district=(u.searchParams.get('district')||'').trim();
 const origin=u.origin; const warehouse=await loadJSON(`${origin}/data/eci_assembly_2022_warehouse_step89.json`); if(!warehouse?.records)return json({ok:false,error:'warehouse_unavailable'},503); const records=warehouse.records;
 const booths=await loadAllBooths(origin);
 const enriched=records.map(x=>({...x,region:regionOf[x.district]||'Unmapped'}));
 let rows=enriched;
 if(region)rows=rows.filter(x=>x.region.toLowerCase()===region.toLowerCase());
 if(district)rows=rows.filter(x=>x.district.toLowerCase()===district.toLowerCase());
 if(ac)rows=rows.filter(x=>x.ac_no===ac);
 if(q)rows=rows.filter(x=>[x.constituency,x.district,x.region,String(x.ac_no)].some(v=>String(v||'').toLowerCase().includes(q)));
 const by=(arr,key)=>Object.values(arr.reduce((m,x)=>(m[x[key]]??=[]).push(x),m),{}); // unused safe helper
 const group=(arr,key)=>{const m={};for(const x of arr){const k=x[key]||'Unknown';(m[k]??=[]).push(x)}return Object.entries(m).map(([name,rs])=>({name,region:rs[0].region,district:rs[0].district,metrics:sum(rs),constituencies:rs.length}))};
 let data=[];
 if(level==='state') data=[{name:'Uttar Pradesh',metrics:sum(enriched),regions:Object.keys(REGIONS).length,districts:new Set(enriched.map(x=>x.district)).size,assemblies:enriched.length}];
 else if(level==='region') data=group(rows,'region').sort((a,b)=>a.name.localeCompare(b.name));
 else if(level==='district') data=group(rows,'district').sort((a,b)=>a.name.localeCompare(b.name));
 else if(level==='assembly') data=rows.sort((a,b)=>a.ac_no-b.ac_no).map(x=>({ac_no:x.ac_no,name:x.constituency,district:x.district,region:x.region,category:x.category,metrics:{booths:x.booth_count,winner:x.winner,winner_party:x.winner_party,winner_votes:x.winner_votes,winner_vote_share:x.winner_vote_share,runner_up:x.runner_up,margin_votes:x.margin_votes,turnout_pct:x.turnout_pct},intelligence_status:'2022_verified_baseline; current_evidence_required'}));
 else if(level==='booth'){
   data=rows.sort((a,b)=>a.ac_no-b.ac_no).map(x=>{const b=booths[String(x.ac_no)]; const preview=b?.booths_preview||[]; return {ac_no:x.ac_no,name:x.constituency,district:x.district,region:x.region,verified_booth_count:x.booth_count,detail_status:b?.source_status||'unavailable',detail_scope:'preview_only_when_source_file_is_not_present',booths_preview:preview.slice(0,50),parties_present:b?.parties_present||[],category_counts:b?.category_counts||{}}});
 } else return json({ok:false,error:'invalid_level',allowed:['state','region','district','assembly','booth']},400);
 return json({ok:true,step:'STEP112',name:'VANDIRA State → Region → District → Assembly → Booth Intelligence',checked_at:new Date().toISOString(),level,filters:{q:q||null,region:region||null,district:district||null,ac},hierarchy:{state:'Uttar Pradesh',region_count:Object.keys(REGIONS).length,district_count:new Set(enriched.map(x=>x.district)).size,assembly_count:enriched.length},data,booth_detail:{verified_assembly_booth_totals:true,booth_record_detail_is_source_dependent:true,preview_records_may_be_partial:true},provenance:{warehouse:'data/eci_assembly_2022_warehouse_step89.json',booth_chunks:'data/booth_ac_*.json',source_tier:1},guardrails:['2022 is the verified baseline in this layer','Current 2027 claims require fresh evidence','Booth previews are never represented as complete booth universes unless source coverage is complete','2024 Lok Sabha segment context remains separate','No sensitive voter profiling or targeting']});
}
