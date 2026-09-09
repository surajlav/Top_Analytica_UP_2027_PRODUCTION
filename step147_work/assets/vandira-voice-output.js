/* VANDIRA STEP118 — local browser Text-to-Speech layer. No audio is uploaded. */
(function(){
  const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const locales={auto:'hi-IN',hi:'hi-IN',mr:'mr-IN',en:'en-IN',te:'te-IN',ta:'ta-IN',bn:'bn-IN',gu:'gu-IN',kn:'kn-IN',ml:'ml-IN',pa:'pa-IN',or:'or-IN',as:'as-IN'};
  let voices=[];
  function refresh(){voices=supported?window.speechSynthesis.getVoices():[]; return voices;}
  if(supported){refresh(); window.speechSynthesis.onvoiceschanged=refresh;}
  function locale(){const l=localStorage.getItem('eviraLanguage')||'auto'; return locales[l]||'hi-IN';}
  function pickVoice(lang){const v=voices.length?voices:refresh(); return v.find(x=>x.lang===lang)||v.find(x=>x.lang.toLowerCase().startsWith(lang.split('-')[0].toLowerCase()))||null;}
  function speak(text, opts={}){
    if(!supported || !String(text||'').trim()) return {ok:false,reason:'unsupported'};
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(String(text));
    const lang=opts.lang||locale(); u.lang=lang; u.rate=Number(opts.rate)||0.94; u.pitch=Number(opts.pitch)||1; u.volume=1;
    const voice=pickVoice(lang); if(voice) u.voice=voice;
    u.onstart=()=>window.dispatchEvent(new CustomEvent('vandira:tts-start'));
    u.onend=()=>window.dispatchEvent(new CustomEvent('vandira:tts-end'));
    u.onerror=e=>window.dispatchEvent(new CustomEvent('vandira:tts-error',{detail:e.error||'error'}));
    window.speechSynthesis.speak(u); return {ok:true};
  }
  function stop(){if(supported)window.speechSynthesis.cancel();}
  function pause(){if(supported)window.speechSynthesis.pause();}
  function resume(){if(supported)window.speechSynthesis.resume();}
  window.VANDIRA_TTS={supported,speak,stop,pause,resume,voices:()=>refresh(),locale};
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-vandira-tts]'); if(!b)return;
    const action=b.dataset.vandiraTts;
    if(action==='stop')stop(); else if(action==='pause')pause(); else if(action==='resume')resume(); else if(action==='speak')speak(b.dataset.text||'');
  });
})();
