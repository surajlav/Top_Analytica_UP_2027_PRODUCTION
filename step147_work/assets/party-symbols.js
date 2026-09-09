(function(){
  const ROOT='assets/party-symbols/';
  const MAP={
    BJP:{name:'Bharatiya Janata Party',symbol:'Lotus',file:'bjp-lotus.png'},
    SP:{name:'Samajwadi Party',symbol:'Bicycle',file:'sp-bicycle.png'},
    BSP:{name:'Bahujan Samaj Party',symbol:'Elephant',file:'bsp-elephant.png'},
    INC:{name:'Indian National Congress',symbol:'Hand',file:'inc-hand.png'},
    RLD:{name:'Rashtriya Lok Dal',symbol:'Hand Pump',file:'rld-handpump.png'},
    SBSP:{name:'Suheldev Bharatiya Samaj Party',symbol:'Walking Stick',file:'sbsp-walking-stick.png'},
    ADS:{name:'Apna Dal (Soneylal)',symbol:'Cup and Saucer',file:'ads-cup-saucer.svg'},
    NISHAD:{name:'NISHAD Party',symbol:'Plate Full of Food',file:'nishad-thali.svg'},
    JDL:{name:'Jansatta Dal (Loktantrik)',symbol:'Saw',file:'jdl-saw.svg'},
    ADK:{name:'Apna Dal (Kamerawadi)',symbol:'Envelope',file:'adk-envelope.svg'},
    JDU:{name:'Janata Dal (United)',symbol:'Arrow',file:'jdu-arrow.svg'},
    AAP:{name:'Aam Aadmi Party',symbol:'Broom',file:'aap-broom.svg'},
    IND:{name:'Independent',symbol:'Candidate-specific symbol',file:null}
  };
  function norm(p){const v=String(p||'').trim().toUpperCase();return v==='AD(S)'?'ADS':(v==='AD(K)'?'ADK':(v==='JD(L)'?'JDL':(v==='JD(U)'?'JDU':v)))}
  function meta(p){return MAP[norm(p)]||null}
  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  function symbolHTML(p, opts={}){
    const k=norm(p),m=meta(k); if(!m) return esc(p||'—');
    const cls=opts.className||'party-symbol'; const size=opts.size||22;
    const img=m.file?`<img class="${cls}" src="${ROOT+m.file}" width="${size}" height="${size}" alt="${esc(m.symbol)}" title="${esc(m.symbol)}" loading="lazy">`:'';
    return `<span class="party-symbol-wrap" title="${esc(m.name)} · ${esc(m.symbol)}">${img}<span>${esc(k)}</span></span>`;
  }
  function badge(p, opts={}){
    const k=norm(p),m=meta(k); if(!m)return `<span class="party-text">${esc(p||'—')}</span>`;
    return `<span class="party-badge">${symbolHTML(k,{size:opts.size||24})}</span>`;
  }
  window.PARTY_SYMBOLS=MAP;
  window.partySymbolMeta=meta;
  window.partySymbolHTML=symbolHTML;
  window.partyBadgeHTML=badge;
  window.partySymbolName=p=>meta(p)?.symbol||'';
})();
