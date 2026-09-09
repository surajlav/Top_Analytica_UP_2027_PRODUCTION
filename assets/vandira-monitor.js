/* STEP100 — browser-local proactive monitoring baseline. */
(function(){
  const KEY='vandiraMonitorBaselineV1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
  const save=(scope,signals)=>{const x=read();x[scope]={checked_at:new Date().toISOString(),signals:(signals||[]).map(s=>({fingerprint:s.fingerprint,url:s.url,title:s.title,type:s.type,severity:s.severity,source:s.source,tier:s.tier,published_at:s.published_at}))};localStorage.setItem(KEY,JSON.stringify(x));return x[scope]};
  window.VandiraMonitor={KEY,read,save};
})();
