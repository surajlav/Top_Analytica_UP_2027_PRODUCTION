const HEADERS={'content-type':'application/json; charset=utf-8','cache-control':'no-store',};
const TYPES={
  briefing:'Briefing',press_note:'Press Note',social_post:'Social Post',public_statement:'Public Statement',faq:'FAQ',issue_explainer:'Issue Explainer',constituency_update:'Constituency Update'
};
const LANGS={hi:'हिंदी',en:'English',mr:'मराठी',te:'తెలుగు',ta:'தமிழ்',bn:'বাংলা',gu:'ગુજરાતી',kn:'ಕನ್ನಡ',ml:'മലയാളം',pa:'ਪੰਜਾਬੀ',or:'ଓଡ଼ିଆ',as:'অসমীয়া'};
const blocked=/(caste|जात|religion|धर्म|religious|community|समुदाय|gender|लिंग|ethnicity|race|income|आय|minority|अल्पसंख्य|micro.?target|मतदाता समूह|voter segment|persuad|मत बदल|vote for|वोट दें|वोट दिल|support us|समर्थन करें)/i;
const escText=s=>String(s||'').replace(/\s+/g,' ').trim().slice(0,6000);
function factsFromInput(facts){
  if(Array.isArray(facts)) return facts.map(escText).filter(Boolean).slice(0,12);
  return String(facts||'').split(/\n+/).map(escText).filter(Boolean).slice(0,12);
}
function draft(type,language,topic,facts){
  const hi=language==='hi'||language==='auto';
  const title=topic||TYPES[type]||'Public Communication Draft';
  const labels=hi?{context:'संदर्भ',facts:'सत्यापित तथ्य',note:'महत्त्वपूर्ण नोट',source:'स्रोत',next:'फैक्ट-चेक से पहले प्रकाशन न करें'}:{context:'Context',facts:'Verified facts',note:'Important note',source:'Sources',next:'Do not publish before fact-check'};
  const body=facts.length?facts.map((f,i)=>`${i+1}. ${f}`).join('\n'):(hi?'इस विषय पर पर्याप्त सत्यापित तथ्य उपलब्ध नहीं हैं।':'Insufficient verified facts are available for this topic.');
  const templates={
    briefing:hi?`# ${title}\n\n${labels.context}\nयह एक evidence-led briefing draft है।\n\n${labels.facts}\n${body}\n\n${labels.note}\nयह draft सार्वजनिक तथ्य-संचारासाठी है; इसमें अनुमान, अप्रमाणित दावे या मतदाता-प्रोफाइलिंग शामिल नहीं की जानी चाहिए।\n\n${labels.next}`:`# ${title}\n\n${labels.context}\nEvidence-led briefing draft.\n\n${labels.facts}\n${body}\n\n${labels.note}\nThis is public factual communication and should not contain speculation, unsupported claims, or voter profiling.\n\n${labels.next}`,
    press_note:hi?`# प्रेस नोट: ${title}\n\nउपलब्ध सत्यापित जानकारी के अनुसार:\n${body}\n\nटिप्पणी: प्रकाशन से पहले प्रत्येक तथ्य, तारीख और स्रोत की स्वतंत्र जाँच आवश्यक है।`:`# Press Note: ${title}\n\nBased on the available verified information:\n${body}\n\nNote: Independently verify every fact, date and source before publication.`,
    social_post:hi?`# सार्वजनिक सोशल पोस्ट ड्राफ्ट\n\n${title}\n\n${body}\n\nस्रोत/संदर्भ उपलब्ध होने पर पोस्ट में स्पष्ट रूप से जोड़े जाएँ।`:`# Public Social Post Draft\n\n${title}\n\n${body}\n\nAdd clear source references where available.`,
    public_statement:hi?`# सार्वजनिक वक्तव्य\n\nविषय: ${title}\n\nहम उपलब्ध सत्यापित जानकारी के आधार पर यह तथ्य साझा कर रहे हैं:\n${body}\n\nआगे की जानकारी आधिकारिक/विश्वसनीय स्रोतों से सत्यापित होने पर अपडेट की जाएगी।`:`# Public Statement\n\nSubject: ${title}\n\nWe are sharing the following based on available verified information:\n${body}\n\nFurther information will be updated after verification from official/reliable sources.`,
    faq:hi?`# FAQ: ${title}\n\nप्रश्न: उपलब्ध तथ्य क्या हैं?\nउत्तर: ${body}\n\nप्रश्न: क्या यह 2027 के परिणाम का पूर्वानुमान है?\nउत्तर: नहीं। यह केवल उपलब्ध evidence का सार्वजनिक तथ्यात्मक सार है।`:`# FAQ: ${title}\n\nQ: What are the available facts?\nA: ${body}\n\nQ: Is this a prediction of the 2027 result?\nA: No. It is only a factual summary of available evidence.`,
    issue_explainer:hi?`# मुद्दा विश्लेषण: ${title}\n\n${body}\n\nक्या ज्ञात है: केवल ऊपर दिए गए सत्यापित तथ्य।\nक्या अभी ज्ञात नहीं है: प्रतिनिधिक जनमत/मैदानी निष्कर्ष, जब तक स्वतंत्र evidence उपलब्ध न हो।`:`# Issue Explainer: ${title}\n\n${body}\n\nKnown: only the verified facts above.\nNot established: representative public opinion or field conclusions unless independent evidence is available.`,
    constituency_update:hi?`# विधानसभा क्षेत्र अपडेट: ${title}\n\nउपलब्ध सत्यापित जानकारी:\n${body}\n\nयह अपडेट constituency-wide public opinion या 2027 outcome का दावा नहीं करता।`:`# Constituency Update: ${title}\n\nAvailable verified information:\n${body}\n\nThis update does not claim constituency-wide public opinion or a 2027 outcome.`
  };
  return templates[type]||templates.briefing;
}
export async function onRequestOptions(){return new Response('',{status:204,headers:HEADERS});}
export async function onRequestGet(){
  return new Response(JSON.stringify({step:'STEP109',name:'VANDIRA Communication / Content Studio',content_types:TYPES,languages:LANGS,statuses:['draft','fact-check-required','approved','publish-ready'],guardrails:['public/non-targeted communication','no invented statistics or claims','no fabricated endorsements or poll results','no sensitive demographic targeting','sources and dates required before publication']}),{headers:HEADERS});
}
export async function onRequestPost({request}){
  let p={};try{p=await request.json()}catch{return new Response(JSON.stringify({error:'invalid_json'}),{status:400,headers:HEADERS});}
  const type=TYPES[p.type]?p.type:'briefing'; const language=LANGS[p.language]?p.language:'hi'; const topic=escText(p.topic); const facts=factsFromInput(p.facts||p.evidence);
  if(blocked.test(`${topic}\n${facts.join('\n')}`)) return new Response(JSON.stringify({error:'guardrail_blocked',message:'Content Studio does not create sensitive-audience targeting or direct voter-persuasion content.',status:'draft'}),{status:400,headers:HEADERS});
  const sources=Array.isArray(p.sources)?p.sources.map(s=>({title:escText(s?.title),url:escText(s?.url),source:escText(s?.source),published_at:s?.published_at||null})).filter(s=>s.title||s.url).slice(0,12):[];
  const status=facts.length?'fact-check-required':'draft';
  return new Response(JSON.stringify({step:'STEP109',type,type_label:TYPES[type],language,language_label:LANGS[language],topic:topic||TYPES[type],draft:draft(type,language,topic,facts),status,verification:{facts_present:facts.length>0,source_count:sources.length,checklist:['Verify every factual claim','Verify dates and numbers','Confirm source URLs','Check quote/attribution accuracy','Confirm no unsupported forecast or endorsement','Human approval before publishing']},sources,guardrails:['public/non-targeted communication','no sensitive voter profiling','no fabricated claims','no invented statistics','no fabricated endorsement/poll result']}),{headers:HEADERS});
}
