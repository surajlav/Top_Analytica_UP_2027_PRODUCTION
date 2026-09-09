/* Top Analytica — canonical data service
   All constituency pages resolve data from the /data root relative to the page URL.
   This avoids hard-coded deployment roots and keeps AC -> booth chunk alignment deterministic. */
(function(){
  const cache = new Map();
  const json = async (path) => {
    const url = new URL(path, document.baseURI).href;
    if(cache.has(url)) return cache.get(url);
    const p = fetch(url, {cache:'no-store'}).then(r=>{
      if(!r.ok) throw new Error(`Data load failed: ${r.status} ${url}`);
      return r.json();
    });
    cache.set(url,p); return p;
  };
  const pad = n => String(n).padStart(3,'0');
  const chunkFile = ac => {
    const start = Math.floor((Number(ac)-1)/50)*50+1;
    const end = Math.min(start+49,403);
    return `data/booth_ac_${pad(start)}_${pad(end)}.json`;
  };
  window.DataService = {
    async loadConstituency(ac){
      const form20Start = Math.floor((Number(ac)-1)/50)*50+1;
      const form20End = Math.min(form20Start+49,403);
      const form20File = `data/form20_booth_intelligence_2022_${pad(form20Start)}_${pad(form20End)}.json`;
      const [canonical, assembly2022, history, candidateMap, form20Map, recent2024, form20Booth, booth] = await Promise.all([
        json('data/assembly_canonical_master.json'),
        json('data/assembly_2022_master.json'),
        json('data/historical_assembly_2012_2017.json'),
        json('data/candidate_party_mapping_2022.json'),
        json('data/form20_candidate_map_2022.json'),
        json('data/lok_sabha_2024_assembly_segment_results.json').catch(()=>null),
        json(form20File).catch(()=>null),
        json(chunkFile(ac)).catch(()=>null)
      ]);
      return {constituencies:canonical.constituencies, assembly2022, history, candidateMap:candidateMap, recent2024, form20Map, form20Booth, booth};
    }
  };
})();
