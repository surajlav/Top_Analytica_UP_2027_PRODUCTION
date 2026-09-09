(function(){
  async function check(){
    const el=document.getElementById('vandira-integration-strip');
    if(!el)return;
    try{
      const r=await fetch('/api/ai-integration',{cache:'no-store'});
      const d=await r.json();
      const ready=d?.provider_readiness?.configured_count>0;
      const active=d?.module_summary?.active||0, total=d?.module_summary?.total||0;
      const label=ready?'VANDIRA AI runtime: live provider ready':'VANDIRA AI runtime: retrieval ready · model provider pending';
      el.querySelector('span:last-child').textContent=`${label} · ${active}/${total} integration modules responding`;
      el.dataset.status=d?.status||'unknown';
    }catch(e){
      el.querySelector('span:last-child').textContent='VANDIRA AI runtime: integration status unavailable';
      el.dataset.status='unavailable';
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check);else check();
})();
