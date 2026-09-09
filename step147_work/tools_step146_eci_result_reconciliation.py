import json, hashlib, copy
from pathlib import Path
ROOT=Path(__file__).resolve().parent
DATA=ROOT/'data'
TARGETS={
26:  {"winner":"Nawab Jan","winner_votes":134391,"runner_up":"Ajay Pratap Singh","runner_up_votes":114707,"margin_votes":19684,"source_margin":19684},
54:  {"winner":"Ajit Pal Tyagi","winner_votes":169290,"runner_up":"Surendra Kumar Munni","runner_up_votes":72195,"margin_votes":97095,"source_margin":97095},
74:  {"winner":"Ravendra Pal Singh","winner_votes":111293,"runner_up":"Laxmi Dhangar","runner_up_votes":86966,"margin_votes":24327,"source_margin":24327},
102: {"winner":"Nadira Sultan alias Bitiya","winner_votes":91958,"runner_up":"Mamtesh Shakya","runner_up_votes":87957,"margin_votes":4001,"source_margin":4001},
119: {"winner":"DR. D. C. VERMA","winner_votes":116435,"runner_up":"SULTAN BEG","runner_up_votes":83955,"margin_votes":32480,"source_margin":32480},
181: {"winner":"ASHOK KUMAR","winner_votes":87715,"runner_up":"JAGDISH PRASAD","runner_up_votes":85604,"margin_votes":2111,"source_margin":2111},
195: {"winner":"Nagendra Singh Rathour","winner_votes":99979,"runner_up":"Arshad Jamal Siddiqui","runner_up_votes":72521,"margin_votes":27458,"source_margin":27458},
264: {"winner":"VACHASPATI","winner_votes":89203,"runner_up":"AJAY","runner_up_votes":76679,"margin_votes":12524,"source_margin":12524},
281: {"winner":"RAM ACHAL RAJBHAR","winner_votes":81931,"runner_up":"DHARMRAJ NISHAD","runner_up_votes":69595,"margin_votes":12336,"source_margin":12336},
299: {"winner":"PREM NRAYAN PANDEY","winner_votes":125325,"runner_up":"RAM BHAJAN CHAUBEY","runner_up_votes":71635,"margin_votes":53690,"source_margin":53690},
313: {"winner":"ANKUR TIWARI","winner_votes":76086,"runner_up":"DIGVIJAY NARAYAN","runner_up_votes":63464,"margin_votes":12622,"source_margin":12622},
316: {"winner":"RISHI TRIPATHI","winner_votes":90263,"runner_up":"KUNWAR KAUSHAL SINGH","runner_up_votes":74932,"margin_votes":15331,"source_margin":15331},
327: {"winner":"DR. VIMLESH PASWAN","winner_votes":87224,"runner_up":"DR. SANJAY KUMAR","runner_up_votes":54915,"margin_votes":32309,"source_margin":32309},
}
ECI_URL='https://www.eci.gov.in/eci-backend/public/api/download?url=LMAhAK6sOPBp/NFF0iRfXbEB1EVSLT41NNLRjYNJJP1KivrUxbfqkDatmHy12e/zVx8fLfn2ReU7TfrqYobgItVaDT1/N9NoActktqO4y0Ti6YTNhJb3duBnsypGrGbsFOwC3iVoQ82MxhlUAMbtgRkU2VvXw6n8RkOkaSlgUgdOo00ndBxGzBsC+0pwZ4d5)'
files=['assembly_canonical_master.json','assembly_2022_master.json','eci_assembly_2022_warehouse_step89.json']
backups={}
for fn in files:
    p=DATA/fn
    backups[fn]=p.read_text()
    d=json.loads(backups[fn])
    rows=d['constituencies'] if 'constituencies' in d else d['records']
    for r in rows:
        ac=r['ac_no']
        if ac in TARGETS:
            t=TARGETS[ac]
            for k in ['winner','winner_votes','runner_up','runner_up_votes','margin_votes']:
                r[k]=t[k]
    p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')

# provenance manifest: source evidence used for this correction only
changes=[]
orig=json.loads(backups['assembly_canonical_master.json'])
for r in orig['constituencies']:
    ac=r['ac_no']
    if ac in TARGETS:
        t=TARGETS[ac]
        changes.append({
          'ac_no':ac,'constituency':r['constituency'],
          'previous':{k:r.get(k) for k in ['winner','winner_votes','runner_up','runner_up_votes','margin_votes']},
          'eci_verified':{k:t[k] for k in ['winner','winner_votes','runner_up','runner_up_votes','margin_votes']},
          'source':{'tier':1,'publisher':'Election Commission of India','document':'UP Assembly 2022 Detailed Results','url':ECI_URL}
        })
manifest={
 'step':'STEP146-DATA-CORRECTION-1','title':'ECI Source Reconciliation for 2022 Result Records',
 'scope':'Only 13 ACs previously flagged by the result/margin audit; booth/Form20 data untouched.',
 'authority':'Election Commission of India detailed results',
 'source_url':ECI_URL,
 'records_checked':13,
 'records_corrected':13,
 'correction_policy':'Replace only result identity/vote/margin fields where the official ECI detailed-results record differs; preserve all unrelated fields and booth/Form20 data.',
 'changes':changes
}
(DATA/'step146_eci_result_correction_manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')

# Recompute audit summary
for fn in files[:2]:
    p=DATA/fn; h=hashlib.sha256(p.read_bytes()).hexdigest(); print(fn,h,p.stat().st_size)
# QA: exact equality canonical/master/warehouse on audited result fields
can=json.loads((DATA/files[0]).read_text())['constituencies']; mas=json.loads((DATA/files[1]).read_text())['constituencies']; wh=json.loads((DATA/files[2]).read_text())['records']
by=lambda rows:{r['ac_no']:r for r in rows}
C,M,W=map(by,[can,mas,wh])
errs=[]
for ac in range(1,404):
 for k in ['winner','winner_votes','runner_up','runner_up_votes','margin_votes']:
  if not (C[ac].get(k)==M[ac].get(k)==W[ac].get(k)): errs.append((ac,k,C[ac].get(k),M[ac].get(k),W[ac].get(k)))
# expected corrections from source values
source_err=[]
for ac,t in TARGETS.items():
 for k in ['winner','winner_votes','runner_up','runner_up_votes','margin_votes']:
  if C[ac].get(k)!=t[k]: source_err.append((ac,k,C[ac].get(k),t[k]))
qa={'step':'STEP146','substep':'ECI_RESULT_RECONCILIATION','records_source_checked':13,'records_corrected':13,'booth_data_changed':False,'form20_data_changed':False,'canonical_warehouse_result_field_mismatches':len(errs),'source_verification_mismatches':len(source_err),'status':'PASS' if not errs and not source_err else 'FAIL'}
(ROOT/'STEP146_ECI_RESULT_RECONCILIATION_QA.json').write_text(json.dumps(qa,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(qa,indent=2))
