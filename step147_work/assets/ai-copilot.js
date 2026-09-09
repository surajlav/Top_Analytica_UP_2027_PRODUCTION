/* Top Analytica AI Political Intelligence Copilot v3
   Real API-ready chatbot + verified local fallback. Read-only data integration. */
(function(){
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const currentLanguage=()=>window.EVIRA_LANGUAGE?.get?.()||localStorage.getItem('eviraLanguage')||window.TopAnalyticaLanguage?.lang?.()||'en';
  const isEn=()=>currentLanguage()==='en';
  const qs=()=>new URLSearchParams(location.search);
  let selectedHomeAC=Number(localStorage.getItem('taAiAC')||0)||null;
  let homeData=null;
  const getContext=(extra={})=>{try{return window.TopAnalyticaContext?.build(extra.db||window.DB||homeData||{}, {...extra, acNo:extra.acNo||selectedHomeAC||undefined})||{}}catch(e){return {}}};
  const pct=(v)=>v==null||v===''?'—':`${Number(v).toFixed(2)}%`;
  const fmt=(v)=>v==null||v===''?'—':Number(v).toLocaleString('en-IN');
  function movementAnswer(c,isEnglish){
    const a=c.assembly_2022||{}, h=c.history||{}, l=c.lok_sabha_2024_assembly_segment;
    const h17=h['2017'], h12=h['2012'];
    const parts=[];
    if(h17?.winner_party && a.winner_party) parts.push(isEnglish?`Party control moved from ${h17.winner_party} in 2017 to ${a.winner_party} in 2022.`:`2017 में ${h17.winner_party} से 2022 में ${a.winner_party} तक सीट का विजेता दल बदला।`);
    if(h17?.margin_votes!=null && a.margin_votes!=null) parts.push(isEnglish?`The winning margin changed from ${fmt(h17.margin_votes)} to ${fmt(a.margin_votes)} votes.`:`जीत का अंतर ${fmt(h17.margin_votes)} से बदलकर ${fmt(a.margin_votes)} वोट हुआ।`);
    if(l?.winner_party) parts.push(isEnglish?`The 2024 Lok Sabha Assembly-segment layer shows ${l.winner_party} ahead with ${pct(l.winner_share_pct)} vote share, versus ${l.runner_up_party||'—'} at ${pct(l.runner_up_share_pct)}.`:`2024 लोकसभा के विधानसभा-सेगमेंट डेटा में ${l.winner_party} ${pct(l.winner_share_pct)} वोट शेयर के साथ आगे था; ${l.runner_up_party||'—'} का शेयर ${pct(l.runner_up_share_pct)} था।`);
    return {answer:parts.join(' ')+(parts.length?'':(isEnglish?'Verified movement data is incomplete for this constituency.':'इस विधानसभा के लिए सत्यापित movement data अधूरा है।')),key_points:[h12?.winner_party?`${isEnglish?'2012 winner':'2012 विजेता'}: ${h12.winner_party}`:null,h17?.winner_party?`${isEnglish?'2017 winner':'2017 विजेता'}: ${h17.winner_party}`:null,a.winner_party?`${isEnglish?'2022 winner':'2022 विजेता'}: ${a.winner_party}`:null,l?.winner_party?`${isEnglish?'2024 LS segment leader':'2024 लोकसभा सेगमेंट अग्रणी'}: ${l.winner_party}`:null].filter(Boolean),sources:['2012/2017 historical Assembly data','2022 Assembly canonical data','2024 Lok Sabha Assembly Segment data'],confidence:'grounded-local',data_gaps:[!h12||!h17?'Historical 2012/2017 data incomplete.':null,!l?'2024 Lok Sabha Assembly Segment data unavailable.':null].filter(Boolean)};
  }
  function historyAnswer(c,isEnglish){
    const h=c.history||{}; const rows=['2012','2017'].map(y=>h[y]?`${y}: ${h[y].winner||'—'} (${h[y].winner_party||'—'}) · margin ${fmt(h[y].margin_votes)}`:null).filter(Boolean);
    return {answer:rows.length?rows.join(isEnglish?'\n':'\n'):(isEnglish?'Historical data is unavailable for this constituency.':'इस विधानसभा का ऐतिहासिक डेटा उपलब्ध नहीं है।'),key_points:rows,sources:['Historical Assembly data · 2012/2017'],confidence:rows.length?'grounded-local':'low'};
  }
  function boothIntelligenceAnswer(c,isEnglish){
    const b=c.booth_preview?.full_booth_stats; const party=c.selected_party||'selected party';
    if(!b) return {answer:isEnglish?'Full booth records are not available for this constituency. I will not infer booth strength from incomplete data.':'इस विधानसभा के लिए full booth records उपलब्ध नहीं हैं। अधूरे डेटा से बूथ strength का अनुमान नहीं लगाया जाएगा।',sources:['Form20 booth intelligence'],confidence:'low',data_gaps:['Full booth records unavailable']};
    const strongest=(b.strongest_booths||[]).slice(0,3).map(x=>`#${x.booth_no} ${x.selected_party_share_pct==null?'—':Number(x.selected_party_share_pct).toFixed(1)+'%'}`).join(', ');
    const weakest=(b.weakest_booths||[]).slice(0,3).map(x=>`#${x.booth_no} ${x.selected_party_share_pct==null?'—':Number(x.selected_party_share_pct).toFixed(1)+'%'}`).join(', ');
    const lead=b.selected_party_lead_booths, total=b.booths_used;
    const answer=isEnglish?`${party} has ${fmt(b.selected_party_votes)} votes across ${fmt(total)} Form20 booths in this constituency, equal to ${pct(b.selected_party_vote_share_pct)} of recorded votes. It leads on ${fmt(lead)} of ${fmt(total)} booths. Highest recorded party vote-share booths: ${strongest||'—'}. Lowest: ${weakest||'—'}. These are descriptive 2022 Form20 signals, not a forecast of the 2027 result.`:`${party} के ${fmt(b.selected_party_votes)} वोट इस विधानसभा के ${fmt(total)} Form20 बूथों में दर्ज हैं, जो recorded votes का ${pct(b.selected_party_vote_share_pct)} है। यह पार्टी ${fmt(lead)} में से ${fmt(total)} बूथों पर आगे थी। सबसे अधिक recorded vote-share वाले बूथ: ${strongest||'—'}। सबसे कम: ${weakest||'—'}। ये 2022 Form20 के descriptive signals हैं, 2027 परिणाम का forecast नहीं।`;
    return {answer,key_points:[isEnglish?`Booths covered: ${fmt(total)}`:`कवर किए गए बूथ: ${fmt(total)}`,isEnglish?`Party vote share: ${pct(b.selected_party_vote_share_pct)}`:`पार्टी vote share: ${pct(b.selected_party_vote_share_pct)}`,isEnglish?`Booth leads: ${fmt(lead)} / ${fmt(total)}`:`बूथ lead: ${fmt(lead)} / ${fmt(total)}`],sources:['Form20 booth intelligence · 2022'],confidence:'grounded-local',data_gaps:[]};
  }
  function campaignAnswer(c,isEnglish){
    const a=c.assembly_2022||{}, b=c.booth_preview, l=c.lok_sabha_2024_assembly_segment;
    const points=isEnglish?[
      `Start with the verified 2022 baseline: ${a.winner_party||'—'} won by ${fmt(a.margin_votes)} votes with ${pct(a.turnout_pct)} turnout.`,
      b?`Use the visible Form20 preview as an operational diagnostic only: ${fmt(b.booths_used)} booths are represented; do not treat it as a full-seat forecast.`:'The Form20 preview is unavailable, so booth-level planning should not be inferred.',
      l?`Compare the 2024 Lok Sabha Assembly-segment result separately from the Assembly baseline; it is not a 2024 Assembly election result.`:'Do not infer a 2024 segment movement without the verified segment layer.',
      `Next step: define objectives, field coverage, issue collection, volunteer workflow and reporting cadence; keep any public messaging evidence-based and non-targeted.`
    ]:[
      `2022 की सत्यापित बेसलाइन से शुरुआत करें: ${a.winner_party||'—'} ने ${fmt(a.margin_votes)} वोटों से जीत दर्ज की; मतदान ${pct(a.turnout_pct)} रहा।`,
      b?`दिखाई गई Form20 प्रीव्यू को केवल operational diagnostic मानें: इसमें ${fmt(b.booths_used)} बूथ हैं; इसे पूरी सीट का forecast न मानें।`:'Form20 प्रीव्यू उपलब्ध नहीं है, इसलिए बूथ-स्तरीय निष्कर्ष अनुमान से न निकालें।',
      l?`2024 लोकसभा विधानसभा-सेगमेंट परिणाम को 2022 विधानसभा बेसलाइन से अलग पढ़ें; इसे 2024 विधानसभा परिणाम न मानें।`:'सत्यापित 2024 segment layer के बिना movement का अनुमान न लगाएं।',
      `अगला चरण: लक्ष्य, field coverage, issue collection, volunteer workflow और reporting cadence तय करें; सार्वजनिक messaging evidence-based और non-targeted रखें।`
    ];
    return {answer:points.join('\n'),key_points:[isEnglish?'Verified baseline':'सत्यापित बेसलाइन',isEnglish?'Booth diagnostic':'बूथ diagnostic',isEnglish?'2024 segment comparison':'2024 segment तुलना',isEnglish?'Operational workflow':'ऑपरेशनल workflow'],sources:['2022 Assembly canonical data','Form20 booth intelligence preview','2024 Lok Sabha Assembly Segment data'],confidence:'grounded-local',data_gaps:[!b?'Form20 booth preview unavailable.':null,!l?'2024 Lok Sabha Assembly Segment unavailable.':null].filter(Boolean)};
  }
  function issueAnswer(c,isEnglish){
    return {answer:isEnglish?`The current verified election dataset does not contain constituency-level public-opinion or issue-priority polling. I can map verified election signals, but I should not invent which roads, jobs, water, health or other issues are dominant. For an issue brief, add source-attributed field reports, survey results or public records first.`:`मौजूदा सत्यापित चुनावी dataset में विधानसभा-स्तर का public-opinion या issue-priority polling उपलब्ध नहीं है। मैं सत्यापित चुनावी संकेतों का मानचित्रण कर सकता हूँ, लेकिन सड़क, रोजगार, पानी, स्वास्थ्य आदि में कौन-सा मुद्दा प्रमुख है यह गढ़ना उचित नहीं होगा। Issue brief के लिए source-attributed field reports, survey results या public records जोड़ें।`,key_points:[isEnglish?'No verified issue-priority polling in current dataset':'मौजूदा dataset में issue-priority polling नहीं',isEnglish?'Add source-attributed field evidence before ranking issues':'मुद्दों की ranking से पहले source-attributed field evidence जोड़ें'],sources:['Current verified election dataset'],confidence:'low',data_gaps:['Constituency-level issue polling / field reports']};
  }
  function localAnswer(q,ctx){
    const c=ctx?.constituency||{}; const a=c.assembly_2022||{}; const b=c.booth_preview; const l=c.lok_sabha_2024_assembly_segment; const ql=String(q||'').toLowerCase();
    if(!c.ac_no)return {answer:isEn()?'Select a constituency first so I can ground the answer in verified seat data.':'पहले विधानसभा चुनें ताकि उत्तर सत्यापित सीट डेटा पर आधारित हो।',sources:['Verified constituency data'],confidence:'low',data_gaps:['No constituency selected']};
    const name=c.name||`AC ${c.ac_no}`;
    if(/campaign|प्रचार|अभियान|रणनीति|बूथ प्लान|वार रूम/.test(ql)) return campaignAnswer(c,isEn());
    if(/issue|issues|problem|development|road|water|jobs|employment|education|health|farmer|किसान|मुद्दा|मुद्दे|समस्या|विकास|सड़क|पानी|रोजगार|शिक्षा|स्वास्थ्य/.test(ql)) return issueAnswer(c,isEn());
    if(/2012|2017|history|historical|इतिहास|ऐतिहासिक|पिछला चुनाव/.test(ql)) return historyAnswer(c,isEn());
    if(/2024|lok sabha|vote share|swing|movement|change|trend|लोकसभा|वोट शेयर|स्विंग|बदलाव|ट्रेंड/.test(ql)) return movementAnswer(c,isEn());
    if(/booth|बूथ/.test(ql)) return boothIntelligenceAnswer(c,isEn());
    if(/2024|lok sabha|लोकसभा/.test(ql)) return {answer:l?(isEn()?`In the 2024 Lok Sabha election, the ${name} Assembly segment recorded ${l.winner_party} with ${Number(l.winner_votes).toLocaleString('en-IN')} votes (${l.winner_share_pct}%), followed by ${l.runner_up_party} with ${Number(l.runner_up_votes).toLocaleString('en-IN')} votes. This is Assembly-segment data from the Lok Sabha election, not a 2024 Assembly election.`:`2024 लोकसभा चुनाव में ${name} विधानसभा सेगमेंट में ${l.winner_party} को ${Number(l.winner_votes).toLocaleString('en-IN')} वोट (${l.winner_share_pct}%) मिले और ${l.runner_up_party} को ${Number(l.runner_up_votes).toLocaleString('en-IN')} वोट मिले। यह लोकसभा चुनाव का विधानसभा-सेगमेंट डेटा है, 2024 विधानसभा चुनाव परिणाम नहीं।`):isEn()?'The 2024 Lok Sabha Assembly Segment layer is not available for this AC.':'इस AC के लिए 2024 लोकसभा विधानसभा-सेगमेंट डेटा उपलब्ध नहीं है.',sources:['2024 Lok Sabha Assembly Segment data'],confidence:l?'grounded-local':'low'};
    if(/opposition|विरोधी|विपक्ष/.test(ql)) return {answer:isEn()?`The 2022 baseline shows ${a.winner||'—'} (${a.winner_party||'—'}) as winner and ${a.runner_up||'—'} (${a.runner_up_party||'—'}) as runner-up, with a margin of ${a.margin_votes??'—'}. That is a historical baseline; current opposition strength needs current, source-attributed content.`:`2022 बेसलाइन में ${a.winner||'—'} (${a.winner_party||'—'}) विजेता और ${a.runner_up||'—'} (${a.runner_up_party||'—'}) रनर-अप थे, जीत का अंतर ${a.margin_votes??'—'} था। यह ऐतिहासिक बेसलाइन है; वर्तमान विपक्षी ताकत के लिए ताज़ा स्रोत-आधारित कंटेंट जरूरी है।`,sources:['2022 Assembly canonical data'],confidence:'grounded-local'};
    if(/chief minister|cm|मुख्यमंत्री|सीएम|police|पुलिस|current|today|latest|news|ताज़ा|ताजा|वर्तमान|करंट/.test(ql)) return {answer:isEn()?'This is a current/general political question. The dedicated AI runtime will use live web sources when the Worker is deployed; the static site cannot safely invent a current fact.':'यह वर्तमान/सामान्य राजनीतिक प्रश्न है। Worker deploy होने के बाद AI runtime live web sources से सत्यापित उत्तर देगा; static site अपने-आप वर्तमान तथ्य नहीं गढ़ेगा।',sources:['AI runtime · live web search'],confidence:'low',data_gaps:['Live Worker not available in this fallback path']};
    return {answer:isEn()?`AC ${c.ac_no} ${name}: the verified 2022 baseline shows ${a.winner||'—'} (${a.winner_party||'—'}) won by ${a.margin_votes??'—'} votes over ${a.runner_up||'—'} (${a.runner_up_party||'—'}). The AI layer can combine this with the 2024 segment and booth preview without inventing missing current facts.`:`AC ${c.ac_no} ${name}: सत्यापित 2022 बेसलाइन में ${a.winner||'—'} (${a.winner_party||'—'}) ने ${a.runner_up||'—'} (${a.runner_up_party||'—'}) के ऊपर ${a.margin_votes??'—'} वोटों से जीत दर्ज की। AI लेयर 2024 सेगमेंट और बूथ प्रीव्यू को इसके साथ जोड़ सकती है, लेकिन अनुपलब्ध वर्तमान तथ्य नहीं बनाएगी।`,sources:['2022 Assembly canonical data'],confidence:'grounded-local'};
  }
  const freshJSON=async url=>{
    const join=url.includes('?')?'&':'?';
    const r=await fetch(`${url}${join}_t=${Date.now()}`,{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
    if(!r.ok)throw new Error(`HTTP ${r.status} for ${url}`);
    return r.json();
  };
  async function loadHomeContext(acNo,party){
    if(!window.TOP_ASSEMBLY_DB)return {};
    const [assembly2022,history,recent2024,candidateMap,form20Map]=await Promise.all([
      freshJSON('data/assembly_2022_master.json'),freshJSON('data/historical_assembly_2012_2017.json'),freshJSON('data/lok_sabha_2024_assembly_segment_results.json').catch(()=>null),freshJSON('data/candidate_party_mapping_2022.json').catch(()=>null),freshJSON('data/form20_candidate_map_2022.json').catch(()=>null)
    ]);
    const start=Math.floor((Number(acNo)-1)/50)*50+1,end=Math.min(start+49,403),pad=n=>String(n).padStart(3,'0');
    const f20=await freshJSON(`data/form20_booth_intelligence_2022_${pad(start)}_${pad(end)}.json`).catch(()=>null);
    homeData={constituencies:window.TOP_ASSEMBLY_DB.constituencies,assembly2022,history,recent2024,candidateMap,form20Map,form20Booth:f20,selectedParty:party};
    return getContext({acNo,party});
  }
  // STEP70 — EVIRA Intelligence Router. Routes each question to the narrowest
  // intelligence layer before the AI Worker is called. This is a routing/grounding
  // layer only; it never mutates election data and never invents missing facts.
  const ROUTER_PATTERNS={
    live:/\b(current|today|latest|recent|news|now|breaking|chief minister|cm|police|law and order|सरकार|मुख्यमंत्री|सीएम|पुलिस|कानून व्यवस्था|ताज़ा|ताजा|अभी|वर्तमान|करंट|घडामोड)\b/i,
    booth:/\b(booth|polling station|form ?20| बूथ|मतदान केंद्र|पोलिंग स्टेशन|फॉर्म ?20)\b/i,
    history:/\b(2012|2017|2019|2022|history|historical|past election|इतिहास|ऐतिहासिक|पिछला चुनाव|2022 का चुनाव)\b/i,
    movement:/\b(2024|lok sabha|vote share|swing|movement|change|trend|margin|shift|लोकसभा|वोट शेयर|स्विंग|बदलाव|ट्रेंड|अंतर|मार्जिन)\b/i,
    campaign:/\b(campaign|campaign plan|strategy|booth plan|ground plan|war room|message|communication|प्रचार|अभियान|रणनीति|बूथ प्लान|वार रूम|संदेश|कम्युनिकेशन)\b/i,
    issues:/\b(issue|issues|problem|problems|development|road|water|jobs|employment|education|health|farmer|किसान|मुद्दा|मुद्दे|समस्या|विकास|सड़क|पानी|रोजगार|शिक्षा|स्वास्थ्य)\b/i,
    general:/\b(who|what|why|how|कौन|क्या|क्यों|कैसे|बताइए|समझाइए)\b/i
  };
  function classifyMode(q){
    const x=String(q||'').toLowerCase();
    if(ROUTER_PATTERNS.live.test(x))return 'live';
    if(ROUTER_PATTERNS.booth.test(x))return 'booth';
    if(ROUTER_PATTERNS.history.test(x))return 'history';
    if(ROUTER_PATTERNS.movement.test(x))return 'movement';
    if(ROUTER_PATTERNS.campaign.test(x))return 'campaign';
    if(ROUTER_PATTERNS.issues.test(x))return 'issues';
    return 'seat';
  }
  function routeQuestion(q,ctx,opts={}){
    const x=String(q||'').trim(); const mode=opts.mode||classifyMode(x);
    const c=ctx?.constituency||{};
    const layers={
      live:{label:'Current Politics',sourcePolicy:'live-web-required',grounding:['current political/news sources'],requiresFreshSources:true},
      booth:{label:'Booth Intelligence',sourcePolicy:'verified-form20',grounding:['Form20 booth data','candidate/party mapping'],requiresFreshSources:false},
      history:{label:'Election History',sourcePolicy:'verified-election-data',grounding:['2012/2017/2022 historical election data'],requiresFreshSources:false},
      movement:{label:'Election Movement',sourcePolicy:'verified-election-data',grounding:['2022 Assembly','2024 Lok Sabha assembly-segment data'],requiresFreshSources:false},
      campaign:{label:'Campaign Intelligence',sourcePolicy:'grounded-strategy',grounding:['verified constituency context','booth signals','election movement'],requiresFreshSources:false},
      issues:{label:'Constituency Issues',sourcePolicy:'grounded-issues',grounding:['verified constituency context'],requiresFreshSources:false},
      seat:{label:'Seat Intelligence',sourcePolicy:'verified-election-data',grounding:['2022 Assembly baseline','selected constituency context'],requiresFreshSources:false}
    };
    const r=layers[mode]||layers.seat;
    return {mode,intent:r.label,source_policy:r.sourcePolicy,grounding:r.grounding,requires_fresh_sources:r.requiresFreshSources,ac_no:c.ac_no||opts.acNo||null,constituency:c.name||null,has_context:!!c.ac_no,router_version:'step85.0-data-first-ai-foundation'};
  }
  async function ask(q,opts={}){
    const ctx=opts.context||getContext({acNo:opts.acNo||selectedHomeAC,party:opts.party});
    const route=routeQuestion(q,ctx,opts); const mode=route.mode; const responseLanguage=opts.language||currentLanguage();
    const pc=window.VandiraPersonalContext?.read?.()||{};
    const lastEntity=ctx?.constituency?.ac_no?{type:'constituency',name:ctx.constituency.name||'',ac_no:ctx.constituency.ac_no}:null;
    const personal_context={...pc,runtime:window.VandiraPersonalContext?.runtime?.({selected_ac_no:ctx?.constituency?.ac_no||opts.acNo||null,last_route:route.intent||route.mode,last_entity:lastEntity,recent_turns:opts.recentTurns||[]})||{}};
    try{const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:q,language:responseLanguage,mode,route,context:ctx,personal_context})});if(r.ok){const d=await r.json();if(d?.answer){d.route=d.route||route;return d;}}}catch(e){}
    const fallback=localAnswer(q,ctx); fallback.route=route; return fallback;
  }
  function mount(){
    // Dedicated AI workspace owns the entire viewport. Remove any legacy/global launcher
    // that may have been injected by another script or restored from a cached DOM.
    if(document.body?.dataset?.aiPage){
      document.querySelectorAll('#ta-ai-fab,#ta-ai-chat,.ta-ai-fab,.ta-ai-chat').forEach(el=>el.remove());
      document.documentElement.setAttribute('data-ai-workspace','true');
      window.TopAnalyticaAI={mount,ask,context:getContext,route:routeQuestion,classifyMode,open:()=>location.reload(),close:()=>history.back(),loadHomeContext};
      return;
    }
    if(document.getElementById('ta-ai-fab'))return;
    const fab=document.createElement('button'); fab.id='ta-ai-fab'; fab.className='ta-ai-fab'; fab.type='button'; fab.innerHTML='<span class="ta-ai-fab-icon">✦</span><span data-ai-fab-label>Ask AI</span>';
    document.body.appendChild(fab);
    const panel=document.createElement('aside'); panel.id='ta-ai-chat'; panel.className='ta-ai-chat'; panel.setAttribute('aria-hidden','true');
    panel.innerHTML=`<div class="ta-ai-chat-head"><div><span class="ta-ai-eyebrow">AI POLITICAL INTELLIGENCE</span><h2 data-chat-title>Ask AI</h2><p data-chat-sub>Grounded answers from verified constituency intelligence.</p></div><button type="button" class="ta-ai-close" data-ai-close>×</button></div><div class="ta-ai-chat-body"><div class="ta-ai-seat-picker" data-home-picker><label data-seat-label>Select constituency</label><select id="ta-ai-seat"><option value="">Select a constituency…</option></select></div><div class="ta-ai-welcome" data-chat-welcome>Hi. I’m your constituency intelligence copilot. Ask about 2022, 2024, booth strength or opposition signals.</div><div class="ta-ai-chat-prompts"><button data-q-hi="इस विधानसभा की राजनीतिक स्थिति क्या है?" data-q-en="What does the verified data say about this seat?">What does the verified data say about this seat?</button><button data-q-hi="बूथ डेटा से मेरी पार्टी की ताकत क्या दिखती है?" data-q-en="What does the booth data show about my party’s strength?">What does the booth data show about my party’s strength?</button><button data-q-hi="2022 और 2024 में क्या बदलाव दिखता है?" data-q-en="What changed between 2022 and 2024?">What changed between 2022 and 2024?</button><button data-q-hi="मुख्य विपक्ष के बारे में क्या दिखता है?" data-q-en="What does the data show about the main opposition?">What does the data show about the main opposition?</button></div><div class="ta-ai-chat-input"><input id="ta-ai-chat-input" autocomplete="off" placeholder="Ask a question…"><button id="ta-ai-chat-send" type="button">Send</button></div><div id="ta-ai-chat-output" class="ta-ai-chat-output" aria-live="polite"></div></div>`;
    document.body.appendChild(panel);
    const picker=panel.querySelector('[data-home-picker]');
    const localize=()=>{const en=isEn();panel.querySelector('[data-chat-title]').textContent=en?'Ask AI':'AI से पूछें';panel.querySelector('[data-chat-sub]').textContent=en?'Grounded answers from verified constituency intelligence.':'सत्यापित विधानसभा इंटेलिजेंस से आधारित उत्तर।';panel.querySelector('[data-chat-welcome]').textContent=en?'Hi. I’m your constituency intelligence copilot. Ask about 2022, 2024, booth strength or opposition signals.':'नमस्ते। मैं आपका Constituency Intelligence Copilot हूँ। 2022, 2024, बूथ ताकत या विपक्षी संकेत पूछें।';panel.querySelector('#ta-ai-chat-input').placeholder=en?'Ask a question…':'अपना सवाल पूछें…';panel.querySelector('#ta-ai-chat-send').textContent=en?'Send':'भेजें';panel.querySelector('[data-seat-label]').textContent=en?'Select constituency':'विधानसभा चुनें';panel.querySelectorAll('.ta-ai-chat-prompts button').forEach(b=>{b.textContent=en?b.dataset.qEn:b.dataset.qHi;b.dataset.q=en?b.dataset.qEn:b.dataset.qHi});fab.querySelector('[data-ai-fab-label]').textContent=en?'Ask AI':'AI से पूछें';};
    async function populate(){if(!window.TOP_ASSEMBLY_DB||!picker)return;const s=panel.querySelector('#ta-ai-seat');if(s.options.length>1)return; s.innerHTML='<option value="">'+(isEn()?'Select a constituency…':'विधानसभा चुनें…')+'</option>'+window.TOP_ASSEMBLY_DB.constituencies.map(x=>`<option value="${x.ac_no}">AC ${x.ac_no} · ${esc(x.constituency)}</option>`).join(''); if(selectedHomeAC)s.value=String(selectedHomeAC);}
    const open=async()=>{ const ac=Number(qs().get('ac')||selectedHomeAC||0); const party=qs().get('party')||''; location.href='ai.html'+(ac?`?ac=${ac}${party?'&party='+encodeURIComponent(party):''}`:''); };const close=()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true')};fab.onclick=open;panel.querySelector('[data-ai-close]').onclick=close;
    panel.querySelector('#ta-ai-seat').onchange=e=>{selectedHomeAC=Number(e.target.value)||null;if(selectedHomeAC)localStorage.setItem('taAiAC',String(selectedHomeAC));};
    panel.querySelectorAll('.ta-ai-chat-prompts button').forEach(b=>b.onclick=()=>run(b.dataset.q));panel.querySelector('#ta-ai-chat-send').onclick=()=>{const v=panel.querySelector('#ta-ai-chat-input').value.trim();if(v)run(v)};panel.querySelector('#ta-ai-chat-input').addEventListener('keydown',e=>{if(e.key==='Enter')panel.querySelector('#ta-ai-chat-send').click()});
    async function run(q){const o=panel.querySelector('#ta-ai-chat-output');o.innerHTML=`<div class="ta-ai-typing">${isEn()?'Analysing verified data…':'सत्यापित डेटा का विश्लेषण हो रहा है…'}</div>`;if(!window.DB&&!homeData&&selectedHomeAC) await loadHomeContext(selectedHomeAC,qs().get('party')||undefined); const ctx=getContext({db:window.DB||homeData||{},acNo:selectedHomeAC||Number(qs().get('ac')||0),party:qs().get('party')||undefined}); const d=await ask(q,{context:ctx,acNo:selectedHomeAC,mode:classifyMode(q)});o.innerHTML=`<div class="ta-ai-answer">${esc(d.answer)}</div>${d.key_points?.length?`<ul class="ta-ai-points">${d.key_points.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${d.sources?.length?`<div class="ta-ai-sources">${isEn()?'Sources':'स्रोत'}: ${esc(d.sources.join(' · '))}</div>`:''}${d.data_gaps?.length?`<div class="ta-ai-gaps">${isEn()?'Data gaps':'डेटा सीमा'}: ${esc(d.data_gaps.join(' · '))}</div>`:''}${d.confidence?`<div class="ta-ai-confidence">${isEn()?'Confidence':'विश्वसनीयता'}: ${esc(d.confidence)}</div>`:''}`;}
    localize();document.addEventListener('languagechange',localize);window.TopAnalyticaAI={mount,ask,context:getContext,route:routeQuestion,classifyMode,open,close,loadHomeContext};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
