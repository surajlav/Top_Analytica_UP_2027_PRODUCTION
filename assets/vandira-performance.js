/* STEP114 — local-first browser performance history. */
(function(){
  const KEY='vandiraPerformanceHistoryV1', MAX=30;
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
  const save=sample=>{const x=[...read(),sample].slice(-MAX);localStorage.setItem(KEY,JSON.stringify(x));return x};
  window.VandiraPerformance={KEY,read,save,clear:()=>localStorage.removeItem(KEY)};
})();
