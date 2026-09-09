/** STEP139 — deterministic data conflict resolution policy. Canonical source values remain immutable. */
const num=v=>Number.isFinite(Number(v))?Number(v):null;
const has=(text,re)=>re.test(String(text||''));

export function buildDataConflictGuard({query='',context={},sources=[],provenance=null}={}){
  const q=String(query||'');
  const ac=num(context?.ac_no||context?.acNo||context?.constituency?.ac_no||context?.constituency?.acNo);
  const checks=[]; const conflicts=[]; const warnings=[];
  const add=(id,status,message,details={})=>checks.push({id,status,message,...details});
  const p=provenance||{};
  const margin=(p.margin_integrity?.mismatches||[]).find(x=>num(x.ac_no)===ac);
  const formGap=(p.form20_provenance?.source_gaps||[]).map(Number).includes(ac);
  const partyRecon=p.party_summary_reconciliation||{};
  const asksPartyTotal=has(q,/(party|bjp|sp|congress|भाजपा|सपा|कांग्रेस).*(seat|seats|won|जीत|सीट)|seats.*(party|bjp|sp|congress|भाजपा|सपा|कांग्रेस)/i);
  const asksMargin=has(q,/(margin|मार्जिन|जीत का अंतर|अंतर|lead)/i);
  const asksForm20=has(q,/(form ?20|form20|फॉर्म ?20)/i);
  const asks2024Assembly=has(q,/2024.*(assembly|विधानसभा).*(election|result|चुनाव|परिणाम)|2024.*विधानसभा.*(चुनाव|परिणाम)/i);

  if(margin){
    conflicts.push({type:'MARGIN_SOURCE_VS_DERIVED',ac_no:ac,constituency:margin.constituency,source_value:margin.source_margin_votes,derived_value:margin.derived_margin_votes,delta:margin.delta});
    add('margin_authority','review','Canonical source margin remains authoritative; derived arithmetic must be labelled separately.',{source_value:margin.source_margin_votes,derived_value:margin.derived_margin_votes,delta:margin.delta});
  } else add('margin_authority','pass','No registered source-vs-derived margin conflict for the selected constituency.');

  if(formGap){
    conflicts.push({type:'FORM20_SOURCE_GAP',ac_no:ac});
    add('form20_availability','review','Form20 source is unavailable for this constituency; do not infer zero or fabricate candidate/booth values.');
  } else add('form20_availability','pass','No registered Form20 source gap for the selected constituency.');

  if(partyRecon?.summary_seat_sum!==undefined && partyRecon?.winner_seat_sum!==undefined && Number(partyRecon.summary_seat_sum)!==Number(partyRecon.winner_seat_sum)){
    conflicts.push({type:'PARTY_SUMMARY_RECONCILIATION',winner_records:Number(partyRecon.winner_seat_sum),summary_rows:Number(partyRecon.summary_seat_sum),mismatches:partyRecon.mismatches||[]});
    add('party_summary_authority','review','Canonical constituency winner records are authoritative for seat-by-seat wins; the party summary remains a flagged reconciliation view.',{winner_records:Number(partyRecon.winner_seat_sum),summary_rows:Number(partyRecon.summary_seat_sum)});
  } else add('party_summary_authority','pass','No registered party-summary total conflict.');

  if(asks2024Assembly){
    conflicts.push({type:'ELECTION_CONTEXT_MISLABEL_RISK'});
    add('election_context_2024','blocked','2024 assembly-segment evidence must not be represented as a 2024 Uttar Pradesh Assembly election result.');
  } else add('election_context_2024','pass','2024 election-context terminology is not flagged by the query.');

  if(asksMargin && margin) warnings.push('For this constituency, show the stored source margin first and identify any arithmetic difference as derived/reconciliation metadata.');
  if(asksForm20 && formGap) warnings.push('Form20 is a source gap here; answer only from available verified evidence.');
  if(asksPartyTotal && partyRecon?.mismatches?.length) warnings.push('Party-summary reconciliation has unresolved differences; do not silently merge summary and winner-record totals.');

  let status=checks.some(x=>x.status==='blocked')?'blocked':conflicts.length?'review':'pass';
  return {
    version:'STEP139',status,
    policy:'Canonical source values remain authoritative; derived values are advisory and must be explicitly labelled; unresolved conflicts are surfaced, never silently overwritten.',
    authority:{canonical_source:'authoritative',derived_calculation:'advisory_only',party_summary:'reconciliation_view',form20_gap:'unknown_not_zero'},
    checks,conflicts,warnings,
    selected_ac_no:ac||null,
    query_flags:{asks_party_total:asksPartyTotal,asks_margin:asksMargin,asks_form20:asksForm20,asks_2024_assembly:asks2024Assembly},
    limits:['Deterministic provenance/conflict policy; not an independent source adjudicator.','When source documents disagree beyond the registered registry, human/source review is required.']
  };
}

export function conflictAwareEvidenceNote(conflictGuard={}){
  if(!conflictGuard || conflictGuard.status==='pass') return 'Use canonical source values as authoritative; label any newly computed arithmetic as derived.';
  if(conflictGuard.status==='blocked') return 'Do not answer using a 2024 Assembly-election interpretation of 2024 assembly-segment evidence.';
  return 'A registered data/provenance conflict exists. Prefer the canonical source value, keep derived calculations separate, and explicitly disclose the limitation.';
}
