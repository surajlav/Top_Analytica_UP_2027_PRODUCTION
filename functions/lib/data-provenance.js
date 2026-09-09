/** STEP138 — additive data integrity & provenance helpers. Existing source data is immutable. */
const PROVENANCE_PATH='/data/vandira_data_provenance_step138.json';
export async function loadDataProvenance(request){
  const r=await fetch(new URL(PROVENANCE_PATH,request.url),{headers:{'cache-control':'no-store'}});
  if(!r.ok) throw new Error(`provenance HTTP ${r.status}`);
  return r.json();
}
export function provenanceLabel(report, acNo){
  const margin=report?.margin_integrity?.mismatches?.find(x=>Number(x.ac_no)===Number(acNo));
  const formGap=(report?.form20_provenance?.source_gaps||[]).map(Number).includes(Number(acNo));
  return {
    canonical:'SOURCE_VERIFIED_IMMUTABLE',
    margin:margin?{status:'SOURCE_VS_DERIVED_CONFLICT',source_margin_votes:margin.source_margin_votes,derived_margin_votes:margin.derived_margin_votes,delta:margin.delta}:null,
    form20:formGap?'SOURCE_GAP_NOT_FABRICATED':'VERIFIED_SUBSET_OR_NOT_REQUESTED'
  };
}
