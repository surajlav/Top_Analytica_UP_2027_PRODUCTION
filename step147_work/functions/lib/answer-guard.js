/**
 * STEP135 — deterministic answer quality / hallucination guard.
 * This is a structural validator, not a semantic fact-checker.
 */
const norm = s => String(s ?? '').toLowerCase().replace(/[,₹%]/g,'').replace(/\s+/g,' ').trim();
const hasAny = (s, patterns) => patterns.some(p => p.test(s));
const numbers = s => [...String(s||'').matchAll(/(?<![\w])(?:₹\s*)?\d{1,3}(?:,\d{2,3})*(?:\.\d+)?%?(?![\w])/g)].map(m=>m[0]);
const numericValue = token => Number(String(token).replace(/[^0-9.]/g,''));

function evidenceText(sources=[], context={}) {
  return norm([
    JSON.stringify(context||{}),
    ...(sources||[]).map(s=>[s.headline,s.summary,s.source,s.published_at,s.source_url].join(' '))
  ].join(' '));
}

function claimNumbers(answer) {
  const text=String(answer||'');
  const claims=[];
  const re=/(?:\b\d[\d,]*(?:\.\d+)?%?\b)/g;
  for(const m of text.matchAll(re)) {
    const before=text.slice(Math.max(0,m.index-45),m.index);
    const after=text.slice(m.index+m[0].length,m.index+m[0].length+45);
    const window=`${before} ${after}`;
    if(/\b(?:ac|विधानसभा|seat|seats|सीट|vote|votes|मत|मतों|margin|मार्जिन|elector|electors|voter|voters|booth|booths|बूथ|turnout|मतदान|share|प्रतिशत|%|percent|प्रतिशतता)\b/i.test(window)) claims.push(m[0]);
  }
  return [...new Set(claims)];
}

export function guardAnswer({answer,sources=[],context={},query='',route={},freshnessRequired=false}={}) {
  const text=String(answer||'').trim();
  const lower=text.toLowerCase();
  const evidence=evidenceText(sources,context);
  const checks=[]; const violations=[]; const warnings=[];
  const add=(id,ok,message,level='warning')=>{checks.push({id,ok,message});if(!ok)(level==='block'?violations:warnings).push(message)};

  add('answer_present',!!text,'AI answer is present.','block');
  add('answer_length',text.length>=12,'AI answer contains enough text for structural review.','warning');

  const futureForecast=hasAny(lower,[
    /2027\s*(?:में|me|will|shall)?[^.\n]{0,80}\b(?:जीतेगा|जीतेगी|जीते|जीत|winner|win|won|will win|बहुमत|majority|सरकार बनाएगा|सरकार बनेगी)/i,
    /\b(?:will win|will lose|win probability|probability of winning|जीतने की संभावना|जीत की संभावना)\b/i
  ]);
  add('forecast_guard',!futureForecast,futureForecast?'Unsupported deterministic 2027 outcome/probability claim detected.':'No unsupported deterministic 2027 outcome/probability claim detected.','block');

  const wrong2024=hasAny(lower,[
    /2024\s+(?:assembly|विधानसभा)\s+(?:election|elections|result|results|चुनाव|परिणाम)/i,
    /2024\s+(?:में\s+)?(?:विधानसभा\s+)?चुनाव\s+परिणाम/i
  ]);
  add('2024_election_type_guard',!wrong2024,wrong2024?'2024 data is incorrectly described as a 2024 Assembly election result.':'2024 Lok Sabha assembly-segment data is not described as a 2024 Assembly election result.','block');

  const currentClaim=hasAny(lower,[/\b(?:today|latest|current|now|अभी|आज|ताज़ा|ताजा|वर्तमान)\b/i]);
  const sourceCount=(sources||[]).length;
  const freshSource=(sources||[]).some(s=>s.live_official || s.official_connector || (s.published_at && !Number.isNaN(new Date(s.published_at).getTime()) && (Date.now()-new Date(s.published_at).getTime())<=7*86400000));
  if(freshnessRequired||currentClaim) add('freshness_guard',sourceCount>0 && freshSource,'Current/latest claims have a fresh or live source basis.','warning');
  else add('freshness_guard',true,'Fresh-source requirement is not triggered.','warning');

  const claims=claimNumbers(text);
  const unsupported=[];
  for(const token of claims){
    const v=numericValue(token);
    if(!Number.isFinite(v)) continue;
    const n=norm(token);
    const present=evidence.includes(n) || evidence.includes(String(v));
    // Year/AC identifiers are contextual identifiers, not standalone fabricated statistics.
    const year=(v>=1900&&v<=2035);
    const ac=(v>=1&&v<=403 && new RegExp(`\\b(?:ac|विधानसभा)\\s*${Math.round(v)}\\b`,'i').test(lower));
    if(!present && !year && !ac) unsupported.push(token);
  }
  add('numeric_claim_grounding',unsupported.length===0,unsupported.length?`Potentially unsupported numeric claims: ${unsupported.join(', ')}.`:'Numeric claims found in the answer have a matching value in supplied context/evidence.','warning');

  const noEvidenceClaim=hasAny(lower,[/\b(?:according to|reports say|reported|officially|आधिकारिक|रिपोर्ट के अनुसार|सूत्रों के अनुसार)\b/i]);
  if(noEvidenceClaim) add('source_attribution',sourceCount>0,'Attribution language is backed by supplied sources.','warning');
  else add('source_attribution',true,'No explicit unsupported attribution language detected.','warning');

  const gaps=sourceCount===0 && (route?.requires_fresh_sources || freshnessRequired);
  add('evidence_availability',!gaps,'Required evidence is available for the selected route.','warning');

  let status='pass';
  if(violations.length) status='blocked';
  else if(warnings.length) status='review';
  return {
    version:'STEP135',status,
    summary:status==='pass'?'Answer passed deterministic structural checks.':status==='blocked'?'Answer contains a blocked hallucination-risk pattern and should not be treated as verified.':'Answer requires review because one or more grounding checks are incomplete.',
    checks,violations,warnings,
    numeric_claims:{found:claims,unsupported},
    limits:['Deterministic structural guard; not an independent semantic fact-check.','Numeric grounding checks compare against supplied context/evidence and may require human review for derived calculations.']
  };
}
