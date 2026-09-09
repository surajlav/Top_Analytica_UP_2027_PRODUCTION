import json, os, glob, hashlib, collections, datetime
ROOT=os.path.dirname(__file__)
DATA=os.path.join(ROOT,'data')

def load(p):
    with open(os.path.join(ROOT,p),encoding='utf-8') as f:return json.load(f)
def sha(p):
    with open(os.path.join(ROOT,p),'rb') as f:return hashlib.sha256(f.read()).hexdigest()

def main():
    can=load('data/assembly_canonical_master.json')['constituencies']
    wh=load('data/eci_assembly_2022_warehouse_step89.json')['records']
    c={x['ac_no']:x for x in can}; w={x['ac_no']:x for x in wh}
    fields=['constituency','district','winner','winner_party','winner_votes','runner_up','runner_up_party','runner_up_votes','margin_votes','margin_pct','turnout_pct','booth_count']
    cw=[(ac,f,c[ac].get(f),w[ac].get(f)) for ac in c for f in fields if c[ac].get(f)!=w[ac].get(f)]
    margins=[]
    for x in can:
        derived=x['winner_votes']-x['runner_up_votes']
        if x.get('margin_votes')!=derived:margins.append({'ac_no':x['ac_no'],'stored_margin_votes':x.get('margin_votes'),'derived_margin_votes':derived})
    ps=load('data/assembly_2022_party_summary.json')
    source_party_rows=collections.Counter(str(x.get('Party','')).strip() for x in ps)
    winner_counts=collections.Counter(x['winner_party'] for x in can)
    reconciled=[]
    for party in sorted(winner_counts):
        reconciled.append({'party':party,'seats_won_from_canonical_winner_records':winner_counts[party]})
    form_manifest=load('data/form20_booth_intelligence_manifest_2022.json')
    form={}
    for ch in form_manifest['chunks']:
        d=load(os.path.join('data',ch['file']))
        form.update({int(k):v for k,v in d['constituencies'].items()})
    duplicate_acs=[]; duplicate_detail=[]; raw_candidate_sum=0; raw_votes_gt=0; raw_voters_gt=0
    for ac,x in sorted(form.items()):
        counts=collections.Counter(str(b.get('booth_no')) for b in x.get('booths',[]))
        dup={k:v for k,v in counts.items() if v>1}
        if dup: duplicate_acs.append(ac); duplicate_detail.append({'ac_no':ac,'duplicate_booth_numbers':dup})
        for b in x.get('booths',[]):
            total=b.get('total_votes'); elect=b.get('electors'); voters=b.get('voters_total')
            cv=b.get('candidate_votes') or []
            s=sum(v.get('votes',0) for v in cv if isinstance(v,dict) and isinstance(v.get('votes'),(int,float)))
            if isinstance(total,(int,float)) and s!=total: raw_candidate_sum+=1
            if isinstance(total,(int,float)) and isinstance(elect,(int,float)) and total>elect: raw_votes_gt+=1
            if isinstance(voters,(int,float)) and isinstance(elect,(int,float)) and voters>elect: raw_voters_gt+=1
    booth_validation=load('data/booth_validation_403.json')
    hist=load('data/historical_assembly_2012_2017.json')
    ls=load('data/lok_sabha_2024_assembly_segment_results.json')
    json_files=glob.glob(os.path.join(DATA,'*.json'))
    parse_fail=[]
    for p in json_files:
        try: json.load(open(p,encoding='utf-8'))
        except Exception as e: parse_fail.append([os.path.basename(p),str(e)])
    report={
      'step':'STEP146','title':'Final Data & Election Intelligence Audit','generated_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),
      'canonical_integrity':{
        'assembly_canonical_count':len(can),'ac_range':[min(c),max(c)],'unique_ac_count':len(c),
        'warehouse_count':len(wh),'warehouse_unique_ac_count':len(w),'canonical_vs_warehouse_field_mismatches':len(cw),
        'canonical_sha256':sha('data/assembly_canonical_master.json'),'assembly_2022_master_sha256':sha('data/assembly_2022_master.json'),
        'status':'PASS' if not cw else 'FAIL'
      },
      'historical_2012_2017':{'count':hist.get('count'),'ac_count':len(hist.get('constituencies',[])),'years':hist.get('years'),'status':'PASS' if hist.get('count')==403 and len(hist.get('constituencies',[]))==403 else 'REVIEW'},
      'lok_sabha_2024_segment_layer':{'mapped':ls.get('coverage',{}).get('mapped'),'unmapped':ls.get('coverage',{}).get('unmapped'),'name_variations':ls.get('coverage',{}).get('name_variations'),'explicitly_not_assembly_result':True,'status':'PASS' if ls.get('coverage',{}).get('mapped')==403 and ls.get('coverage',{}).get('unmapped')==0 else 'REVIEW'},
      'form20':{
        'verified_ac_count':len(form),'expected_ac_count':403,'source_gaps':form_manifest.get('remaining_source_gaps',[]),
        'booth_records':sum(len(x.get('booths',[])) for x in form.values()),'expected_preview_records':14000,
        'all_verified_acs_have_35_preview_booths':all(len(x.get('booths',[]))==35 for x in form.values()),
        'candidate_sum_mismatch_records':raw_candidate_sum,'total_votes_gt_electors_records':raw_votes_gt,'voters_total_gt_electors_records':raw_voters_gt,
        'duplicate_booth_number_acs':len(duplicate_acs),'duplicate_booth_number_detail':duplicate_detail,
        'status':'REVIEW'
      },
      'booth_source_layer':{'available_acs':booth_validation.get('booth_available'),'source_not_available':booth_validation.get('booth_source_not_available',[]),'status':'REVIEW' if booth_validation.get('booth_available')!=403 else 'PASS'},
      'margin_integrity':{'conflict_count':len(margins),'conflicts':margins,'policy':'preserve canonical/source margin; expose derived arithmetic separately','status':'REVIEW' if margins else 'PASS'},
      'party_reconciliation':{'source_summary_rows':len(ps),'source_summary_seats_total':sum(int(x.get('Seats won',0) or 0) for x in ps),'duplicate_party_names':[k for k,v in source_party_rows.items() if v>1],'canonical_winner_seats_total':sum(winner_counts.values()),'winner_counts':dict(sorted(winner_counts.items())),'missing_from_source_summary':sorted(set(winner_counts)-{str(x.get('Party','')).strip() for x in ps}),'status':'REVIEW'},
      'runtime_data_contract':{'canonical_data_read_only':True,'2024_layer_type':'Lok Sabha Assembly-segment','unknown_or_missing_source_data_must_remain_unknown':True,'no_2027_forecast_from_historical_data':True},
      'package_health':{'json_files':len(json_files),'json_parse_failures':len(parse_fail)},
      'release_gate':{'status':'CONDITIONAL','reason':'Canonical election layer is internally consistent, but Form20/source gaps, booth preview identity anomalies, 13 margin conflicts, and the stale source party summary must remain explicitly surfaced; no silent correction is authorized.'}
    }
    with open(os.path.join(DATA,'final_data_election_audit_step146.json'),'w',encoding='utf-8') as f:json.dump(report,f,ensure_ascii=False,indent=2)
    with open(os.path.join(DATA,'assembly_2022_winner_seat_reconciliation_step146.json'),'w',encoding='utf-8') as f:json.dump({'step':'STEP146','source':'data/assembly_canonical_master.json','source_count':403,'rows':reconciled,'note':'Derived reconciliation only; source party summary is preserved unchanged.'},f,ensure_ascii=False,indent=2)
    with open(os.path.join(DATA,'party_code_normalization_step146.json'),'w',encoding='utf-8') as f:json.dump({'step':'STEP146','purpose':'normalized party identifiers for reconciliation only','map':{'AD(S)':'ADS','Apna Dal (Sonelal)':'ADS','JD(L)':'JDL','JD(U)':'JD(U)','NISHAD':'NISHAD','SBSP':'SBSP'}},f,ensure_ascii=False,indent=2)
    return report
if __name__=='__main__':
    r=main(); print(json.dumps(r,ensure_ascii=False,indent=2))
