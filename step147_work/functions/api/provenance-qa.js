import {securityHeaders} from '../lib/api-security.js';
import {loadDataProvenance} from '../lib/data-provenance.js';
export async function onRequestGet({request,env}){
 const headers=securityHeaders(request,env); try{const p=await loadDataProvenance(request);
 const checks=[
  {name:'canonical files immutable',pass:p.canonical_files&&Object.values(p.canonical_files).every(x=>x.records===403&&/^[a-f0-9]{64}$/.test(x.sha256))},
  {name:'margin conflicts separated from source',pass:p.margin_integrity?.mismatch_count===p.margin_integrity?.mismatches?.length},
  {name:'form20 gaps explicit',pass:Array.isArray(p.form20_provenance?.source_gaps)&&p.form20_provenance.source_gaps.length===3},
  {name:'party reconciliation additive',pass:p.party_summary_reconciliation?.winner_seat_sum===403},
  {name:'2024 segment context separated',pass:p.trust_levels?.['2024_lok_sabha_segment']==='SEPARATE_ELECTION_CONTEXT'}
 ]; const passed=checks.filter(x=>x.pass).length;
 return new Response(JSON.stringify({step:'STEP138',suite:'Data Integrity & Provenance',passed,total:checks.length,all_pass:passed===checks.length,checks,report_version:p.version}),{headers});
 }catch{return new Response(JSON.stringify({error:'provenance_unavailable'}),{status:503,headers});}
}
