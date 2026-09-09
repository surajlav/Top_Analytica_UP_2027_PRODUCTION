const ROUTES = {
  election_results: {label:'Election Results & History',domains:['eci','election_data','warehouse'],fresh:true},
  constituency_intelligence: {label:'Constituency Intelligence',domains:['constituency','warehouse','booth'],fresh:false},
  candidate_intelligence: {label:'Candidate Intelligence',domains:['candidate','warehouse','eci'],fresh:true},
  booth_intelligence: {label:'Booth & Form 20 Intelligence',domains:['booth','form20','warehouse'],fresh:false},
  party_alliance: {label:'Party & Alliance Intelligence',domains:['party','news','official'],fresh:true},
  competitive_intelligence: {label:'Competitive Intelligence',domains:['warehouse','party','candidate','news','official'],fresh:true},
  issue_ground_intelligence: {label:'Issue & Ground Intelligence',domains:['issues','ground','news','official'],fresh:true},
  research_survey_intelligence: {label:'Research & Survey Intelligence',domains:['research','survey','field','official'],fresh:true},
  campaign_planning: {label:'Campaign Planning Workspace',domains:['planning','constituency','issues','ground','monitoring'],fresh:true},
  content_studio: {label:'Communication / Content Studio',domains:['communication','evidence','sources','language'],fresh:true,guarded:true},
  political_situation_room: {label:'Political Situation Room',domains:['politics','campaign','issues','competitive','alerts','monitoring'],fresh:true},
  executive_leadership_briefing: {label:'Executive / Leadership Briefing',domains:['executive','situation_room','briefing','risk','decision_support'],fresh:true},
  hierarchy_intelligence: {label:'State → Region → District → Assembly → Booth Intelligence',domains:['state','region','district','assembly','booth','warehouse'],fresh:false},
  political_war_room: {label:'Political War Room',domains:['command','alerts','politics','executive','hierarchy','decision_support'],fresh:true},
  monitoring_performance: {label:'Monitoring + Performance Intelligence',domains:['monitoring','performance','runtime','data_health','alerts'],fresh:true},
  election_day_intelligence: {label:'Election-Day Intelligence',domains:['election_day','turnout','booth','incidents','counting','official'],fresh:true},
  audit_security: {label:'Audit / Compliance / Security Intelligence',domains:['audit','security','integrity','provenance','deployment'],fresh:true},
  government_policy: {label:'Government / Cabinet / Policy',domains:['government','assembly','official'],fresh:true},
  assembly_proceedings: {label:'Assembly Proceedings',domains:['assembly','official'],fresh:true},
  political_news: {label:'UP Politics & Current Affairs',domains:['news','official'],fresh:true},
  historical_context: {label:'Historical Political Context',domains:['history','eci','reference'],fresh:false},
  election_forecast: {label:'Scenario / Forecast Analysis',domains:['warehouse','historical','news'],fresh:true,guarded:true},
  system_status: {label:'VANDIRA System Status',domains:['runtime','health'],fresh:true}
};

const norm = s => String(s||'').toLowerCase();

export function classifyQuery(query, context={}) {
  const q=norm(query);
  const ac=Number(context?.ac_no||context?.acNo||context?.constituency_number||0);
  const routes=[];
  const add=(id,score)=>routes.push({id,score,plan:ROUTES[id]});
  const has=(re)=>re.test(q);

  // High-signal intents are evaluated first. These rules deliberately favour the
  // user's explicit task over generic words such as "current" or "result".
  if(has(/booth|form ?20|polling station|मतदान केंद्र|बूथ|फॉर्म ?20/)) add('booth_intelligence',140);
  if(has(/candidate|उम्मीदवार|प्रत्याशी|उमेदवार/)) add('candidate_intelligence',135);

  const comparison=has(/compare|comparison|versus|vs\.?|between|difference|तुलना|तुलनात्मक|फरक|विरुद्ध|बनाम/);
  const party=has(/\bbjp\b|\bsp\b|samajwadi|bharatiya janata|भाजपा|सपा|समाजवादी|बहुजन|बसपा|कांग्रेस|congress|party|पार्टी/);
  const place=has(/district|districts|जिला|जिलों|constituency|assembly|विधानसभा|seat|सीट|निर्वाचन क्षेत्र|lucknow|लखनऊ|kanpur|कानपुर|agra|आगरा/);
  if(comparison && party) add('competitive_intelligence',150);
  if(comparison && party && !place) add('party_alliance',145);
  if(party && has(/seats?|seat count|won|wins|vote share|performance|प्रदर्शन|सीट|जीत|मत प्रतिशत/)) add('party_alliance',132);
  if(comparison && has(/district|districts|जिला|जिलों/)) add('competitive_intelligence',145);

  const year=has(/(?:19|20)\d{2}/);
  if(year && has(/history|historical|result|results|परिणाम|इतिहास|विजेता|जीत/)) add('historical_context',140);
  if(has(/assembly proceedings|bill|discussion|mla|विधेयक|कार्यवाही|सदस्य|विधानसभा में/)) add('assembly_proceedings',138);

  if(has(/system health|system status|runtime health|provider health|^health$|^status$/)) add('system_status',155);
  else if(has(/monitoring|performance|latency|uptime|response time|data health|system performance|runtime performance|monitoring dashboard|कामगिरी|निगराणी|प्रतिसाद वेळ|डेटा आरोग्य|सिस्टम परफॉर्मन्स|मॉनिटरिंग/)) add('monitoring_performance',134);

  if(has(/forecast|predict|projection|scenario|2027|भविष्य|अनुमान|परिदृश्य|कौन जीतेगा|कौन जीतेगी/)) add('election_forecast',125);
  if(has(/issue|ground|local problem|development|infrastructure|employment|agriculture|education|health|law and order|मुद्दा|मुद्दे|ग्राउंड|जमीनी|स्थानिक प्रश्न|विकास|पायाभूत|रोजगार|कृषि|शेती|शिक्षण|आरोग्य|कानून व्यवस्था/)) add('issue_ground_intelligence',112);
  if(has(/survey|poll|sample|sampling|questionnaire|methodology|fieldwork|research|जनमत|सर्वे|नमूना|पद्धति|संशोधन/)) add('research_survey_intelligence',116);
  if(has(/campaign plan|campaign planning|campaign workspace|outreach plan|field plan|activity plan|action plan|अभियान योजना|मोहीम योजना|मैदानी योजना|कार्ययोजना/)) add('campaign_planning',120);
  if(has(/content studio|communication|press note|press release|social post|public statement|faq|issue explainer|प्रेस नोट|प्रेस विज्ञप्ति|सोशल पोस्ट|सार्वजनिक वक्तव्य|सार्वजनिक बयान|सामग्री|कम्युनिकेशन/)) add('content_studio',125);
  if(has(/cabinet|government|scheme|policy|cm|chief minister|सरकार|मंत्रिमंडल|योजना|नीति|मुख्यमंत्री/)) add('government_policy',100);
  if(has(/history|historical|1951|1957|1962|1967|1977|1980|1985|1989|1991|1993|1996|2002|2007|2012|2017|इतिहास/) && !year) add('historical_context',75);
  if(has(/latest|today|current|now|news|political news|राजनीतिक खबर|राजनीतिक समाचार|ताज़ा|ताजा|वर्तमान|अभी|आज/)) add('political_news',85);
  if(has(/executive briefing|leadership briefing|executive summary|leadership brief|what changed|where did it change|why does it matter|what requires attention|leadership|executive|नेतृत्व ब्रीफिंग|कार्यकारी ब्रीफिंग|क्या बदला|क्यों महत्वपूर्ण/)) add('executive_leadership_briefing',132);
  if(has(/situation room|political situation|command room|war room|situation|स्थिति कक्ष|राजनीतिक स्थिति|कमांड रूम/)) add('political_situation_room',128);
  if(has(/state.*region.*district.*assembly.*booth|region.*district.*assembly|district.*assembly.*booth|hierarchy intelligence|hierarchical intelligence|राज्य.*क्षेत्र.*जिला.*विधानसभा.*बूथ|मंडल.*जिला.*विधानसभा.*बूथ|क्षेत्र.*जिला.*विधानसभा/)) add('hierarchy_intelligence',130);
  if(has(/war room|command workspace|command center|command room|decision queue|कमांड वॉर रूम|वार रूम|कमांड सेंटर|निर्णय कतार/)) add('political_war_room',136);
  if(has(/election day|poll day|polling day|polling started|turnout update|booth incident|election incident|counting day|counting update|result day|election operations|मतदान दिवस|मतदानाचा दिवस|मतदान सुरू|मतदान टक्केवारी|मतदान केंद्र घटना|निवडणूक दिवस|मतमोजणी|निकाल दिवस|इलेक्शन डे/)) add('election_day_intelligence',142);

  const result=has(/who won|winner|runner[- ]?up|result|vote|margin|elector|turnout|election result|परिणाम|कौन जीता|कौन जिंकलं|विजेता|उपविजेता|मत|मतदान|जीत|हार/);
  if(result) add('election_results',100);
  if(has(/constituency|assembly seat|vidhan sabha|विधानसभा|निर्वाचन क्षेत्र|सीट/) || (ac>=1&&ac<=403)) add('constituency_intelligence',85);
  if(has(/competitive|competition|contest|contender|rival|close fight|close contest|स्पर्धा|प्रतिस्पर्धा|मुकाबला|काँटे|कांटे|प्रतिद्वंद्वी/)) add('competitive_intelligence',118);
  if(has(/party|alliance|coalition|seat sharing|गठबंधन|पार्टी/) && !routes.some(x=>x.id==='party_alliance')) add('party_alliance',82);

  if(!routes.length) add('political_news',20);
  const unique=[...routes.reduce((m,x)=>{const prev=m.get(x.id);if(!prev||x.score>prev.score)m.set(x.id,x);return m;},new Map()).values()].sort((a,b)=>b.score-a.score);
  const primary=unique[0];
  return {primary_route:primary.id,label:primary.plan.label,confidence:primary.score>=90?'high':primary.score>=75?'medium':'low',requires_fresh_sources:unique.some(x=>x.plan.fresh),guarded_analysis:unique.some(x=>x.plan.guarded),routes:unique.slice(0,4),context:{ac_no:ac||null}};
}

export function electionClock(now=new Date()) {
  const india = new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',dateStyle:'full',timeStyle:'long'}).format(now);
  const end = new Date('2027-05-22T18:30:00+05:30');
  return {now_utc:now.toISOString(),now_india:india,house_term_end:'2027-05-22',days_until_house_term_end:Math.max(0,Math.ceil((end-now)/86400000)),exact_poll_date_confirmed:false};
}

export function buildExecutionPlan(route, context={}) {
  const r=route?.primary_route||'political_news';
  const common=['validate_context','retrieve_structured_election_data','retrieve_official_sources'];
  const plan=[...common];
  if(['political_news','party_alliance','competitive_intelligence','government_policy','assembly_proceedings','candidate_intelligence','election_forecast'].includes(r)) plan.push('retrieve_fresh_discovery');
  if(r==='booth_intelligence') plan.push('load_form20_derived_intelligence');
  if(r==='candidate_intelligence') plan.push('validate_candidate_identity');
  if(r==='research_survey_intelligence') plan.push('validate_survey_metadata','separate_survey_from_election_results');
  if(r==='campaign_planning') plan.push('load_constituency_baseline','attach_verified_intelligence','define_workstreams','schedule_review_cycle','capture_field_feedback','planning_guardrails');
  if(r==='content_studio') plan.push('select_content_type','attach_verified_evidence','draft_content','fact_check_gate','human_approval','content_guardrails');
  if(r==='political_situation_room') plan.push('retrieve_live_political_signals','retrieve_campaign_status','retrieve_issue_signals','retrieve_competitive_signals','retrieve_alerts','build_state_situation_picture','rank_attention_items','attach_provenance','situation_room_guardrails');
  if(r==='executive_leadership_briefing') plan.push('retrieve_situation_room','retrieve_daily_briefing','prioritize_signals','separate_fact_from_analysis','identify_risk_and_opportunity','prepare_next_actions','attach_provenance','leadership_briefing_guardrails');
  if(r==='hierarchy_intelligence') plan.push('resolve_hierarchy','load_state_region_district_assembly','load_verified_booth_totals','load_source_dependent_booth_detail','preserve_2022_baseline','hierarchy_guardrails');
  if(r==='political_war_room') plan.push('retrieve_live_signals','retrieve_alerts','load_executive_briefing','load_hierarchy_context','build_decision_queue','attach_provenance','war_room_guardrails');
  if(r==='monitoring_performance') plan.push('probe_runtime_endpoints','measure_response_latency','check_data_health','inspect_provider_readiness','summarize_monitoring_signals','compute_performance_status','attach_performance_provenance','performance_guardrails');
  if(r==='election_day_intelligence') plan.push('check_official_poll_schedule','load_assembly_booth_baseline','validate_observed_turnout','retrieve_official_process_updates','review_incident_log','prepare_counting_readiness','attach_election_day_provenance','election_day_guardrails');
  if(r==='audit_security') plan.push('verify_canonical_data_integrity','inspect_security_headers','validate_secret_boundary','inspect_audit_configuration','review_provenance_controls','review_deployment_safety','emit_compliance_status');
  if(r==='election_forecast') plan.push('historical_comparison','identify_change_drivers','build_conditional_scenarios','scenario_guardrails','decision_support_framework');
  plan.push('rank_evidence','resolve_conflicts','select_ai_provider','generate_answer','attach_sources','emit_audit_trace');
  return {route:r,steps:plan,context:{ac_no:Number(context?.ac_no||context?.acNo||0)||null}};
}
