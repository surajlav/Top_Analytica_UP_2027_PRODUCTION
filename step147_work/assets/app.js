/* TOP Analytica — shared interaction + Hindi/English language layer */
const acSelect=document.getElementById('acSelect');
const roleSelect=document.getElementById('roleSelect');
const partySelect=document.getElementById('partySelect');
const I18N={
  '⌂ होम':'⌂ Home','♙ विधानसभाएँ':'♙ Assemblies','सभी 403 विधानसभाएँ':'All 403 Constituencies','विधानसभा इंटेलिजेंस':'Constituency Intelligence','निर्णायक सीटें':'Battleground Seats','▣ परिणाम':'▣ Results','2022 विधानसभा':'2022 Assembly','2022 वोट शेयर':'2022 Vote Share','2024 लोकसभा':'2024 Lok Sabha','◈ बैटलग्राउंड्स':'◈ Battlegrounds','▤ रिपोर्ट्स':'▤ Reports','✦ सेवाएँ':'✦ Services','हमारे बारे में':'About Us','रिपोर्ट के लिए संपर्क करें':'Contact for Report','403 विधानसभाएँ':'403 Constituencies','परिणाम':'Results','सेवाएँ':'Services','रिपोर्ट्स':'Reports',
  'विधानसभा, सेवा या रिपोर्ट खोजें…':'Search constituency, service or report…','वेबसाइट खोज':'Website search','आपकी सीट.':'Your Seat.','आपका डेटा. आपकी रणनीति.':'Your Data. Your Strategy.','403 विधानसभा क्षेत्रों के लिए प्रीमियम राजनीतिक इंटेलिजेंस — सत्यापित चुनावी बेसलाइन, विधानसभा संकेत और बूथ-स्तरीय निर्णय सहायता एक ही workflow में।':'Premium political intelligence for 403 constituencies — verified election baseline, constituency signals and booth-level decision support in one workflow.','✓ Verified Election Baseline':'✓ Verified Election Baseline','◉ Constituency Intelligence':'◉ Constituency Intelligence','✦ AI-assisted Insights':'✦ AI-assisted Insights','▣ Client-ready Reports':'▣ Client-ready Reports','MY SEAT':'MY SEAT','अपनी विधानसभा की इंटेलिजेंस खोलें':'Open your constituency intelligence','विधानसभा चुनें · अपनी भूमिका बताएं · पार्टी चुनें':'Choose a seat · tell us your role · choose a party','1. विधानसभा':'1. Constituency','2. आपकी भूमिका':'2. Your Role','3. पार्टी':'3. Party','मेरा विश्लेषण देखें →':'View My Analysis →','INTELLIGENCE SNAPSHOT':'INTELLIGENCE SNAPSHOT','विधानसभा सीटें':'Assembly Seats','जिले':'Districts','पोलिंग बूथ':'Polling Booths','मतदाता':'Voters','उत्तर प्रदेश चुनाव — एक नज़र में':'Uttar Pradesh Election — At a Glance','2022 Assembly baseline + 2024 Lok Sabha signal':'2022 Assembly baseline + 2024 Lok Sabha signal','पूरा परिणाम देखें →':'View Full Results →','ASSEMBLY BASELINE':'ASSEMBLY BASELINE','2022 विधानसभा सीटें':'2022 Assembly Seats','INTELLIGENCE SIGNAL':'INTELLIGENCE SIGNAL','Seat history is the starting point — not the strategy.':'Seat history is the starting point — not the strategy.','VOTE SIGNAL':'VOTE SIGNAL','2022 वोट शेयर':'2022 Vote Share','DATA NOTE':'DATA NOTE','वोट शेयर अलग दिखाया गया है; इसे सीट शेयर के साथ मिश्रित नहीं किया गया है।':'Vote share is shown independently; it is not mixed with seat share.','CONTEXT SIGNAL':'CONTEXT SIGNAL','2024 लोकसभा · उत्तर प्रदेश':'2024 Lok Sabha · Uttar Pradesh','2024 लोकसभा · UP':'2024 Lok Sabha · UP','CONTEXT':'CONTEXT','2024 लोकसभा का verified UP signal 2027 constituency analysis को context देता है.':'The verified 2024 Lok Sabha UP signal provides context for 2027 constituency analysis.','2024 का parliamentary signal 2027 constituency analysis के लिए contextual baseline है.':'The 2024 parliamentary signal is a contextual baseline for 2027 constituency analysis.','उत्तर प्रदेश का राजनीतिक मानचित्र':'Uttar Pradesh Political Map','AI विज़ुअल और सत्यापित विधानसभा डेटा लेयर के लिए एक समर्पित प्रवेश बिंदु':'Dedicated entry point for AI editorial visual + verified constituency data layer','403 सीटें देखें →':'View 403 Seats →','UP 2027':'UP 2027','एक नज़र में पूरा राज्य। एक क्लिक में अपनी सीट।':'The state at a glance. One click to a seat.','विधानसभा डायरेक्टरी →':'Constituency Directory →','परिणाम देखें':'View Results','आपके campaign के लिए हम क्या देखते हैं?':'What do we examine for your campaign?','चुनावी डेटा को निर्णय-योग्य इंटेलिजेंस में बदलने वाला workflow।':'A workflow that turns raw election data into decision-ready intelligence.','सभी सेवाएँ →':'All Services →','Constituency Intelligence':'Constituency Intelligence','Seat profile, results, margin और political context।':'Seat profile, results, margin and political context.','Booth Intelligence':'Booth Intelligence','Selected party और opponent performance signals।':'Selected party and opponent performance signals.','मतदाता Intelligence':'Voter Intelligence','Turnout और constituency-level indicators।':'Turnout and constituency-level indicators.','बैटलग्राउंड सीटें':'Battleground Seats','Priority seats और margin-based ranking।':'Priority seats and margin-based ranking.','Client-ready Reports':'Client-ready Reports','Decision-ready PDF intelligence dossiers.':'Decision-ready PDF intelligence dossiers.','Strategic Advisory':'Strategic Advisory','Data को campaign decisions में translate करें.':'Translate data into campaign decisions.','DATA → INTELLIGENCE → DECISION':'DATA → INTELLIGENCE → DECISION','हर लेयर का उद्देश्य एक ही है — बेहतर चुनावी निर्णय।':'Each layer has one purpose — better campaign decisions.','रणनीतिक चर्चा':'Strategic Discussion','अपनी seat के लिए premium intelligence workflow देखें।':'Explore the premium intelligence workflow for your seat.','Top Analytica का उद्देश्य raw election data को decision-ready intelligence में बदलना है। UP 2027 platform में state overview से constituency और booth intelligence तक एक स्पष्ट digital experience बनाया जा रहा है।':'Top Analytica turns raw election data into decision-ready intelligence. The UP 2027 platform creates a clear digital experience from state overview to constituency and booth intelligence.','Premium Political Data Consultancy':'Premium Political Data Consultancy','Data | Insights | Strategy — political intelligence for better decisions.':'Data | Insights | Strategy — political intelligence for better decisions.','निर्णायक विधानसभा सीटें':'Battleground Assembly Seats','Margin, opposition strength और recent signals से priority view.':'A priority view based on margin, opposition strength and recent signals.','Top battleground table':'Top Battleground Table','Click a seat for intelligence':'Click a seat for intelligence','विधानसभा खोजें':'Search constituency','भूमिका':'Role','पार्टी':'Party','विधानसभा खोलें →':'Open Constituency →','403 सीट directory':'403-seat directory','इंटेलिजेंस →':'Intelligence →','विधानसभा इंटेलिजेंस':'Constituency Intelligence','2022 result baseline · selected party context · booth intelligence preview':'2022 result baseline · selected party context · booth intelligence preview','विश्लेषण अपडेट करें →':'Update Analysis →','चयनित पार्टी का booth overview':'Selected Party Booth Overview','2024 लोकसभा संदर्भ':'2024 Lok Sabha Context','Constituency-linked parliamentary signal':'Constituency-linked parliamentary signal','Comparative context available':'Comparative context available','Booth Intelligence · पहले 30 बूथ':'Booth Intelligence · First 30 Booths','पूर्ण विधानसभा डॉसियर':'Full Constituency Dossier','Full booth data, comparative analysis और strategic recommendations.':'Full booth data, comparative analysis and strategic recommendations.','WhatsApp पर रिपोर्ट लें →':'Get the Report on WhatsApp →','Premium Political Intelligence Reports':'Premium Political Intelligence Reports','Public preview से full client dossier तक एक स्पष्ट conversion journey.':'A clear conversion journey from public preview to full client dossier.','Sample Assembly Report':'Sample Assembly Report','एक constituency का sample intelligence layout.':'A sample constituency intelligence layout.','Sample PDF / Print →':'Sample PDF / Print →','Booth Intelligence Report':'Booth Intelligence Report','Selected party, opponents, booth classification और counts.':'Selected party, opponents, booth classification and counts.','Full report request →':'Full Report Request →','Strategic Dossier':'Strategic Dossier','Seat-level insights, comparative context and recommendations।':'Seat-level insights, comparative context and recommendations.','Consultation →':'Consultation →','Top Analytica — Strategic Services':'Top Analytica — Strategic Services','Data, intelligence और strategy को एक ही premium consulting workflow में।':'Data, intelligence and strategy in one premium consulting workflow.','विधानसभा विश्लेषण':'Assembly Analysis','Seat profile और election history।':'Seat profile and election history.','मतदाता विश्लेषण':'Voter Analysis','Turnout और voter indicators।':'Turnout and voter indicators.','Campaign War Room':'Campaign War Room','Decision support dashboards.':'Decision support dashboards.','Custom Reports':'Custom Reports','Client-ready PDF dossiers.':'Client-ready PDF dossiers.','Strategy Consulting':'Strategy Consulting','Actionable campaign guidance.':'Actionable campaign guidance.','क्या आपको अपनी विधानसभा के लिए custom intelligence चाहिए?':'Need custom intelligence for your constituency?','पूरे data, analysis और strategy dossier के लिए सीधे संपर्क करें।':'Contact us directly for complete data, analysis and strategy dossier.','WhatsApp पर चर्चा करें →':'Discuss on WhatsApp →','उत्तर प्रदेश चुनाव परिणाम — 2022 & 2024':'Uttar Pradesh Election Results — 2022 & 2024','State-level baseline और recent Lok Sabha signal एक ही decision view में.':'State-level baseline and recent Lok Sabha signal in one decision view.','2022 Seat Share':'2022 Seat Share','2022 Vote Share':'2022 Vote Share','2022 Key Highlights':'2022 Key Highlights','Overview':'Overview','2024 लोकसभा — उत्तर प्रदेश':'2024 Lok Sabha — Uttar Pradesh','80 सीटों का verified party-wise overview.':'Verified party-wise overview of all 80 seats.','80 seats का party-wise overview.':'Party-wise overview of 80 seats.','राजनीतिक मानचित्र — 2022':'Political Map — 2022','Visual overview':'Visual overview','LOK SABHA 2024':'LOK SABHA 2024','उत्तर प्रदेश की 80 लोकसभा सीटें':'Uttar Pradesh’s 80 Lok Sabha Seats','80 / 80 सीटें':'80 / 80 seats','80 / 80':'80 / 80','लोकसभा सीटें':'Lok Sabha Seats','सीट शेयर':'Seat Share','वोट शेयर':'Vote Share','सबसे अधिक':'Highest','प्रमुख':'Leading','सहयोगी':'Ally','अन्य':'Other','Coverage':'Coverage','Languages':'Languages','Reports':'Reports','Support':'Support','About Us':'About Us'
};
const I18N_EXTRA={'2024 वोट शेयर':'2024 Vote Share','Party comparison':'Party comparison','2024 का vote share स्वतंत्र रूप से दिखाया गया है; सीट शेयर से अलग पढ़ें।':'The 2024 vote share is shown independently; read it separately from seat share.','DATA NOTE':'DATA NOTE'};Object.assign(I18N,I18N_EXTRA);
Object.assign(I18N, {
  'हमारे बारे में': 'About Us',
  'हम कौन हैं': 'Who We Are',
  'TOP Analytica — भारत की नई पीढ़ी की Political Intelligence & Consulting Company': 'TOP Analytica — India\'s Next-Generation Political Intelligence & Consulting Company',
  'हम चुनावी डेटा, शोध, तकनीक और रणनीति को एक साथ लाकर नेताओं, राजनीतिक दलों और संस्थाओं के लिए निर्णय-आधारित समाधान बनाते हैं।': 'We bring election data, research, technology and strategy together to build decision-ready solutions for political leaders, parties and institutions.',
  'डेटा · रणनीति · परिणाम': 'Data · Strategy · Outcomes',
  '360° अभियान प्रबंधन': '360° Campaign Management',
  'AI-संचालित राजनीतिक इंटेलिजेंस': 'AI-Powered Political Intelligence',
  'निर्वाचन क्षेत्र-स्तरीय विश्लेषण': 'Constituency-Level Analytics',
  'व्यापक शोध और सर्वेक्षण': 'Research & Survey Intelligence',
  'हमारा उद्देश्य': 'Our Purpose',
  'दृष्टि': 'Vision',
  'भारत की विश्वसनीय और तकनीक-सक्षम राजनीतिक परामर्श संस्था बनना, जो डेटा, शोध और AI को प्रभावी रणनीति में बदल सके।': 'To become one of India\'s most trusted and technology-enabled political consulting firms, turning data, research and AI into effective strategy.',
  'मिशन': 'Mission',
  'राजनीतिक नेताओं और संस्थाओं को शोध-आधारित निर्णय, रीयल-टाइम इंटेलिजेंस और जिम्मेदार रणनीतिक परामर्श के माध्यम से सक्षम बनाना।': 'To empower political leaders and institutions through research-led decisions, real-time intelligence and responsible strategic consulting.',
  'हमारी विशेषताएँ': 'Why Top Analytica',
  'AI-संचालित राजनीतिक इंटेलिजेंस': 'AI-Powered Political Intelligence',
  'एंड-टू-एंड अभियान प्रबंधन': 'End-to-End Campaign Management',
  'वैज्ञानिक सर्वेक्षण और शोध': 'Scientific Survey & Research',
  'प्रशिक्षित निर्वाचन क्षेत्र विश्लेषण': 'Advanced Constituency Analytics',
  'पेशेवर चुनावी वार रूम': 'Professional Election War Room',
  'डिजिटल और सोशल मीडिया विशेषज्ञता': 'Digital & Social Media Expertise',
  'गोपनीय और नैतिक परामर्श': 'Confidential & Ethical Consulting',
  'हर क्लाइंट के लिए कस्टम रणनीति': 'Customized Strategy for Every Client',
  'हम कैसे काम करते हैं': 'How We Work',
  'स्रोत डेटा': 'Source Data',
  'सत्यापन': 'Validation',
  'निर्वाचन क्षेत्र मानचित्रण': 'Constituency Mapping',
  'इंटेलिजेंस मॉडलिंग': 'Intelligence Modelling',
  'रणनीतिक निर्णय': 'Strategic Decision',
  'हर सफल अभियान की शुरुआत लोगों, डेटा और जमीनी वास्तविकता को समझने से होती है। हमारी भूमिका इन संकेतों को स्पष्ट और उपयोगी निर्णयों में बदलना है।': 'Every successful campaign begins by understanding people, data and ground reality. Our role is to turn these signals into clear decisions.',
  'रणनीतिक बातचीत शुरू करें': 'Start a Strategic Conversation',
  'पूर्ण प्रोफाइल देखें': 'View Full Profile',
  'सेवाएँ': 'Services',
  'चुनावी डेटा से रणनीतिक बढ़त तक': 'From Election Data to Strategic Advantage',
  'उम्मीदवारों, राजनीतिक दलों और अभियान टीमों के लिए डेटा, शोध, तकनीक और रणनीति का एकीकृत मॉडल।': 'An integrated model of data, research, technology and strategy for candidates, political parties and campaign teams.',
  'हम क्या प्रदान करते हैं': 'What We Provide',
  'राजनीतिक परामर्श': 'Political Consulting',
  'अभियान योजना, नेतृत्व की स्थिति, मुद्दा-मानचित्रण, मतदाता वर्गीकरण और चुनावी रोडमैप।': 'Campaign planning, leadership positioning, issue mapping, voter segmentation and election roadmaps.',
  'चुनावी अभियान प्रबंधन': 'Election Campaign Management',
  '360° अभियान संचालन, फील्ड मॉनिटरिंग, कार्यक्रम, स्वयंसेवक समन्वय और प्रदर्शन ट्रैकिंग।': '360° campaign operations, field monitoring, events, volunteer coordination and performance tracking.',
  'राजनीतिक शोध': 'Political Research',
  'जनसांख्यिकी, राजनीतिक रुझान, स्थानीय मुद्दे, हितधारक और प्रतिद्वंद्वी विश्लेषण।': 'Demographics, political trends, local issues, stakeholder research and competitor assessment.',
  'सर्वेक्षण और ओपिनियन इंटेलिजेंस': 'Survey & Opinion Intelligence',
  'बेसलाइन सर्वे, ओपिनियन पोल, मतदाता भावना, उम्मीदवार मूल्यांकन और सार्वजनिक प्रतिक्रिया का अध्ययन।': 'Baseline surveys, opinion polls, voter sentiment, candidate evaluation and public feedback studies.',
  'विधानसभा इंटेलिजेंस': 'Constituency Intelligence',
  'निर्वाचन क्षेत्र-स्तरीय प्रोफाइल, परिणाम, मार्जिन, प्रतिस्पर्धा और रणनीतिक संकेत।': 'Constituency-level profiles, results, margins, competition and strategic signals.',
  'बूथ एवं ग्राउंड इंटेलिजेंस': 'Booth & Ground Intelligence',
  'बूथ प्रदर्शन, प्राथमिकता क्षेत्र, फील्ड संगठन और मतदान-दिवस की तैयारी।': 'Booth performance, priority areas, field organisation and polling-day readiness.',
  'डिजिटल अभियान और जनसंपर्क': 'Digital Campaign & Public Relations',
  'सोशल मीडिया रणनीति, डिजिटल सामग्री, मीडिया योजना, प्रतिष्ठा और संकट संचार।': 'Social media strategy, digital content, media planning, reputation and crisis communication.',
  'AI-संचालित चुनावी समाधान': 'AI-Powered Election Solutions',
  'पूर्वानुमान, भावना विश्लेषण, ऑटोमेशन, AI सहायक और निर्णय-सहायक डैशबोर्ड।': 'Forecasting, sentiment analysis, automation, AI assistants and decision-support dashboards.',
  'चुनावी वार रूम और टेक्नोलॉजी': 'Election War Room & Technology',
  'रीयल-टाइम मॉनिटरिंग, CRM, GIS मैपिंग, डैशबोर्ड और अभियान रिपोर्टिंग।': 'Real-time monitoring, CRM, GIS mapping, dashboards and campaign reporting.',
  'क्या आप अपनी 2027 रणनीति के लिए तैयार हैं?': 'Ready for Your 2027 Strategy?',
  'अपनी सीट, अभियान या संगठन के लिए गोपनीय रणनीतिक चर्चा शुरू करें।': 'Start a confidential strategic conversation for your seat, campaign or organisation.',
  'रणनीतिक परामर्श लें': 'Request Strategic Consultation',
  'कार्य-प्रवाह': 'Workflow',
  'डेटा': 'Data',
  'शोध': 'Research',
  'इंटेलिजेंस': 'Intelligence',
  'रणनीति': 'Strategy',
  'कार्रवाई': 'Action',
  'गोपनीयता': 'Confidentiality',
  'परिणाम-केंद्रित': 'Outcome-Focused',
  'क्यों TOP Analytica?':'Why TOP Analytica?',
  'तकनीक को निर्णय-सहायता में बदलें।':'Turn technology into decision support.',
  'रणनीति से फील्ड निष्पादन तक।':'From strategy to field execution.',
  'शोध-आधारित राजनीतिक समझ।':'Research-led political understanding.',
  'सीट और बूथ स्तर की इंटेलिजेंस।':'Seat and booth-level intelligence.',
  'रीयल-टाइम मॉनिटरिंग और रिपोर्टिंग।':'Real-time monitoring and reporting.',
  'ब्रांड, पहुंच और जनसंपर्क।':'Brand, reach and public relations.',
  'विश्वास और डेटा सुरक्षा प्राथमिकता।':'Trust and data security come first.',
  'एक ही मॉडल सबके लिए नहीं।':'One model does not fit every campaign.',
  'दृष्टि और मिशन':'Vision & Mission',
  'विश्वसनीयता से नेतृत्व तक':'From credibility to leadership',
  'बेहतर निर्णय, बेहतर तैयारी':'Better decisions, better preparation',
  'DATA → INTELLIGENCE → STRATEGY':'DATA → INTELLIGENCE → STRATEGY',
  'एक ही प्लेटफॉर्म पर निर्णय की पूरी श्रृंखला':'The complete decision chain on one platform',
  'डेटा से रणनीतिक सलाह तक — अलग-अलग टूल के बजाय एक connected workflow।':'From data to strategic advice — one connected workflow, not disconnected tools.',
  'एकीकृत समाधान':'Integrated Solutions',
  'आपके अभियान के लिए एकीकृत समाधान':'Integrated solutions for your campaign',
  'हर सेवा का उद्देश्य: बेहतर जानकारी → स्पष्ट निर्णय → प्रभावी निष्पादन।':'Every service has one goal: better information → clear decisions → stronger execution.',
  'विश्वसनीयता से नेतृत्व तक':'From credibility to leadership',
  'बेहतर जानकारी':'Better Information',
  'स्पष्ट निर्णय':'Clear Decisions',
  'मजबूत निष्पादन':'Stronger Execution',
  'एक राज्य. 403 सीटें. हजारो signals.':'One state. 403 seats. Thousands of signals.',
  'सेवा':'Service',
  'और जानें →':'Learn more →',
  'तकनीक पर बात करें →':'Talk technology →',
  'वार रूम चर्चा →':'Discuss the war room →',
  'रिपोर्ट उदाहरण →':'View report example →',
  '403 सीटें देखें →':'View 403 seats →',
  'संस्थाओं के लिए':'For institutions'
});
const REV=Object.fromEntries(Object.entries(I18N).map(([hi,en])=>[en,hi]));
function textSwap(text,lang){let t=text.trim(); if(lang==='en') return I18N[t]??t; return REV[t]??t;}
function translateTree(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n; if(lang==='en'&&I18N[key]) el.innerHTML=I18N[key]; else if(lang==='hi') el.innerHTML=key;});
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n=>{const raw=n.nodeValue,trim=raw.trim();if(!trim)return;const repl=textSwap(trim,lang);if(repl!==trim)n.nodeValue=raw.replace(trim,repl);});
  document.querySelectorAll('input[placeholder]').forEach(el=>{const base=el.dataset.hiPlaceholder||el.placeholder;el.dataset.hiPlaceholder=base;el.placeholder=lang==='en'?(I18N[base]||base):base;});
  document.documentElement.lang=lang==='en'?'en':'hi';
}
function markAndTranslate(){
  // The site is authored in Hindi-first mode. Preserve original strings so the toggle is reversible.
  document.querySelectorAll('input[placeholder]').forEach(el=>el.dataset.hiPlaceholder=el.placeholder);
}
function setLang(lang){localStorage.setItem('topAnalyticaLang',lang);translateTree(lang);document.querySelectorAll('[data-lang]').forEach(b=>{const on=b.dataset.lang===lang;b.setAttribute('aria-pressed',on?'true':'false');b.classList.toggle('active',on);});document.dispatchEvent(new CustomEvent('languagechange',{detail:{lang}}));}
function normalizeSearchText(v){return String(v||'').toLocaleLowerCase('hi-IN').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[–—]/g,'-').trim();}
function enhanceACSelect(select){
  if(!select || select.dataset.searchableReady==='1') return;
  select.dataset.searchableReady='1';
  const wrap=document.createElement('div'); wrap.className='ac-combobox';
  select.parentNode.insertBefore(wrap,select); wrap.appendChild(select); select.classList.add('ac-native-select');
  const box=document.createElement('div'); box.className='ac-combobox-box'; box.setAttribute('role','combobox'); box.setAttribute('aria-haspopup','listbox'); box.setAttribute('aria-expanded','false'); box.tabIndex=0;
  box.innerHTML='<span class=\"ac-selected\">-- विधानसभा चुनें --</span><span class=\"ac-chevron\">⌄</span>';
  const panel=document.createElement('div'); panel.className='ac-combobox-panel'; panel.innerHTML='<div class=\"ac-search-row\"><span>⌕</span><input type=\"search\" autocomplete=\"off\" placeholder=\"विधानसभा क्रमांक या नाम खोजें…\" aria-label=\"विधानसभा खोजें\"></div><div class=\"ac-results\" role=\"listbox\"></div>';
  wrap.append(box,panel);
  const selected=box.querySelector('.ac-selected'), input=panel.querySelector('input'), results=panel.querySelector('.ac-results');
  let open=false, active=-1;
  function options(){return [...select.options].filter(o=>o.value);}
  function labelFor(o){return o?.textContent||'-- विधानसभा चुनें --';}
  function renderResults(q=''){
    const nq=normalizeSearchText(q); const opts=options();
    const filtered=nq?opts.filter(o=>normalizeSearchText(labelFor(o)).includes(nq) || String(o.value)===nq.replace(/[^0-9]/g,'')):opts;
    results.innerHTML=filtered.length?filtered.map((o,i)=>`<div class=\"ac-result\" role=\"option\" data-value=\"${o.value}\" data-index=\"${i}\"><span class=\"ac-no\">AC ${o.value}</span><span class=\"ac-name\">${labelFor(o).replace(/^AC\s*\d+\s*[·•-]?\s*/,'')}</span></div>`).join(''):'<div class=\"ac-empty\">कोई विधानसभा नहीं मिली</div>';
    active=-1;
    results.querySelectorAll('.ac-result').forEach(el=>el.addEventListener('click',()=>choose(el.dataset.value)));
  }
  function choose(value){
    const opt=options().find(o=>o.value===String(value)); if(!opt)return; select.value=opt.value; selected.textContent=labelFor(opt); selected.classList.add('has-value'); select.dispatchEvent(new Event('change',{bubbles:true})); close();
  }
  function sync(){const opt=options().find(o=>o.value===select.value); selected.textContent=opt?labelFor(opt):'-- विधानसभा चुनें --'; selected.classList.toggle('has-value',!!opt);}
  function openBox(){if(open)return;open=true;box.setAttribute('aria-expanded','true');panel.classList.add('open');input.value='';renderResults();setTimeout(()=>input.focus(),0);}
  function close(){open=false;box.setAttribute('aria-expanded','false');panel.classList.remove('open');}
  box.addEventListener('click',()=>open?close():openBox());
  box.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open?close():openBox();} if(e.key==='Escape')close();});
  input.addEventListener('input',()=>renderResults(input.value));
  input.addEventListener('keydown',e=>{const rows=[...results.querySelectorAll('.ac-result')]; if(e.key==='ArrowDown'){e.preventDefault();active=Math.min(active+1,rows.length-1);rows.forEach((r,i)=>r.classList.toggle('active',i===active));rows[active]?.scrollIntoView({block:'nearest'});}else if(e.key==='ArrowUp'){e.preventDefault();active=Math.max(active-1,0);rows.forEach((r,i)=>r.classList.toggle('active',i===active));rows[active]?.scrollIntoView({block:'nearest'});}else if(e.key==='Enter'&&active>=0){e.preventDefault();choose(rows[active].dataset.value);}else if(e.key==='Escape')close();});
  select.addEventListener('change',sync);
  new MutationObserver(()=>{sync(); if(open)renderResults(input.value);}).observe(select,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))close();});
  sync();
}
async function loadAssemblyOptions(){
  if(!acSelect) return;
  try{
    const db=window.TOP_ASSEMBLY_DB || await fetch('data/assembly_canonical_master.json').then(r=>r.json()); window.TOP_ASSEMBLY_DB=db;
    acSelect.innerHTML='<option value="">-- विधानसभा चुनें --</option>'+db.constituencies.map(x=>`<option value="${x.ac_no}">AC ${x.ac_no} · ${x.constituency}</option>`).join('');
  }catch(e){
    acSelect.innerHTML='<option value="">-- विधानसभा चुनें --</option>'+Array.from({length:403},(_,i)=>`<option value="${i+1}">AC ${i+1}</option>`).join('');
  }
  enhanceACSelect(acSelect);
}
if(acSelect){loadAssemblyOptions();}
if(roleSelect){roleSelect.innerHTML='<option value="">-- अपनी भूमिका चुनें --</option>'+['वर्तमान विधायक','उम्मीदवार / संभावित उम्मीदवार','पार्टी पदाधिकारी','पार्टी कार्यकर्ता','राजनीतिक रणनीतिकार'].map(x=>`<option>${x}</option>`).join('');}
if(partySelect){partySelect.innerHTML='<option value="">-- पार्टी चुनें --</option>'+['BJP','SP','BSP','INC','RLD','SBSP','ADS','NISHAD','अन्य'].map(x=>`<option>${x}</option>`).join('');}
document.querySelectorAll('[data-analyze]').forEach(btn=>btn.addEventListener('click',()=>{const ac=acSelect?.value||'';const role=roleSelect?.value||'';const party=partySelect?.value||'';if(!ac){alert(localStorage.getItem('topAnalyticaLang')==='en'?'Please select a constituency first.':'कृपया पहले विधानसभा चुनें.');return;}const url=new URL('constituency.html',location.href);url.searchParams.set('ac',ac);if(role)url.searchParams.set('role',role);if(party)url.searchParams.set('party',party);location.href=url.href;}));
const menu=document.querySelector('.menu'),mobile=document.querySelector('.mobile-menu');
mobile?.addEventListener('click',()=>{const open=menu?.classList.toggle('open');mobile.setAttribute('aria-expanded',open?'true':'false');});
document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>{menu?.classList.remove('open');mobile?.setAttribute('aria-expanded','false');}));
const searchPanel=document.querySelector('[data-search-panel]');document.querySelector('[data-search-toggle]')?.addEventListener('click',()=>{searchPanel?.classList.toggle('open');if(searchPanel?.classList.contains('open'))searchPanel.querySelector('input')?.focus();});document.querySelector('[data-search-close]')?.addEventListener('click',()=>searchPanel?.classList.remove('open'));
const searchInput=document.querySelector('[data-site-search]');searchInput?.addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.target.value.trim().toLowerCase();if(q.includes('सेवा')||q.includes('service'))location.href='services.html';else if(q.includes('रिपोर्ट')||q.includes('report'))location.href='reports.html';else if(q.includes('परिणाम')||q.includes('result')||q.includes('2022')||q.includes('2024'))location.href='results.html';else location.href='constituencies.html';}});
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
const counters=document.querySelectorAll('[data-count]');const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,end=Number(el.dataset.count||0),suffix=el.dataset.suffix||'';let start=0;const duration=950,begin=performance.now();function tick(now){const p=Math.min(1,(now-begin)/duration),eased=1-Math.pow(1-p,3);el.textContent=Math.round(end*eased).toLocaleString('en-IN')+suffix;if(p<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);countObserver.unobserve(el);}),{threshold:.6});counters.forEach(el=>countObserver.observe(el));
markAndTranslate();
const initial=localStorage.getItem('topAnalyticaLang')||'en';setLang(initial);
