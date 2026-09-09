/* Top Analytica — Data Integrity Guard (additive, non-blocking)
   Never mutates canonical data. Used to diagnose deployment/file drift. */
(function(){
  window.TopAnalyticaDataIntegrity = {
    expectedManifest: 'data/DATA_FREEZE_MANIFEST_STEP36.json',
    async check(){
      try{
        const r=await fetch(this.expectedManifest,{cache:'no-store'});
        if(!r.ok) throw new Error('Freeze manifest unavailable: '+r.status);
        const m=await r.json();
        const report={status:'MANIFEST_LOADED',base:m.base_package,files:m.files?.length||0};
        console.info('[Top Analytica] Data freeze manifest loaded',report);
        return report;
      }catch(e){
        console.warn('[Top Analytica] Data integrity guard could not load manifest',e);
        return {status:'MANIFEST_UNAVAILABLE',error:String(e)};
      }
    }
  };
})();
