/* VANDIRA STEP119 — two-way voice consultant.
 * Browser-local speech recognition + browser-local TTS. Audio is not uploaded by this layer.
 */
(function(){
  'use strict';
  const input=document.getElementById('ai-input');
  const send=document.getElementById('ai-send');
  if(!input||!send) return;
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const LANG={auto:'hi-IN',hi:'hi-IN',en:'en-IN',mr:'mr-IN',te:'te-IN',ta:'ta-IN',bn:'bn-IN',gu:'gu-IN',kn:'kn-IN',ml:'ml-IN',pa:'pa-IN',or:'or-IN',as:'as-IN'};
  const KEY='vandiraTwoWayVoiceV1';
  let active=false,recognition=null,waiting=false,shouldRestart=false;

  const btn=document.createElement('button');
  btn.type='button'; btn.id='vandira-two-way'; btn.className='ai-two-way-voice';
  btn.setAttribute('aria-pressed','false'); btn.setAttribute('aria-label','VANDIRA से दो-तरफ़ा आवाज़ में बात करें');
  btn.title='दो-तरफ़ा Voice'; btn.innerHTML='<span aria-hidden="true">◉</span><span>दो-तरफ़ा Voice</span>';
  send.parentNode.insertBefore(btn,send);

  const status=document.createElement('div'); status.className='ai-two-way-status'; status.setAttribute('aria-live','polite');
  btn.parentNode.parentNode.insertBefore(status,btn.parentNode.nextSibling);

  function lang(){const l=document.documentElement.getAttribute('data-ai-lang')||localStorage.getItem('eviraLanguage')||'hi';return LANG[l]||'hi-IN';}
  function log(type){try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');a.push({type,language:lang(),timestamp:new Date().toISOString()});localStorage.setItem(KEY,JSON.stringify(a.slice(-30)));}catch(_e){}}
  function state(text){status.textContent=text||'';btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));}
  function stopRecognition(){shouldRestart=false;try{recognition&&recognition.stop();}catch(_e){} }
  function startRecognition(){
    if(!active||waiting||!SR)return;
    recognition=new SR(); recognition.lang=lang(); recognition.continuous=false; recognition.interimResults=true; recognition.maxAlternatives=1;
    let finalText='', interim='';
    recognition.onstart=()=>{state('ऐकू येत आहे… बोलून पूर्ण करा.');log('listen_start');};
    recognition.onresult=e=>{interim='';for(let i=e.resultIndex;i<e.results.length;i++){const t=e.results[i][0]?.transcript||'';if(e.results[i].isFinal)finalText+=(finalText?' ':'')+t;else interim+=t;}input.value=(finalText+' '+interim).trim();input.dispatchEvent(new Event('input',{bubbles:true}));};
    recognition.onerror=e=>{log('recognition_error:'+e.error); if(e.error==='not-allowed'||e.error==='service-not-allowed'){active=false;state('मायक्रोफोनची परवानगी आवश्यक आहे.');} else if(active){state('पुन्हा ऐकण्यासाठी तयार…');}};
    recognition.onend=()=>{if(!active)return; if(finalText.trim()){waiting=true;state('प्रश्न पाठवत आहे…');const q=finalText.trim();input.value=q;input.dispatchEvent(new Event('input',{bubbles:true}));send.click();log('question_sent');}else{setTimeout(startRecognition,250);}};
    try{recognition.start();}catch(_e){setTimeout(()=>active&&startRecognition(),400);}
  }
  function toggle(){
    if(!SR){state('या ब्राउझरमध्ये two-way voice उपलब्ध नाही. Chrome/Edge सारखा समर्थित ब्राउझर वापरा.');return;}
    active=!active; waiting=false; log(active?'session_start':'session_stop');
    if(!active){stopRecognition();if(window.VANDIRA_TTS?.stop)window.VANDIRA_TTS.stop();state('');return;}
    state('Voice consultant सुरू आहे…');startRecognition();
  }
  btn.addEventListener('click',toggle);

  window.addEventListener('vandira:assistant-answer',e=>{
    if(!active)return;
    waiting=false;
    const text=String(e.detail?.text||'').trim();
    if(!text){startRecognition();return;}
    stopRecognition();
    if(window.VANDIRA_TTS?.supported){
      state('VANDIRA उत्तर देत आहे…');
      const r=window.VANDIRA_TTS.speak(text,{lang:lang(),rate:.92});
      if(!r?.ok){state('Voice output उपलब्ध नाही. पुन्हा बोलू शकता.');setTimeout(startRecognition,350);}
    }else{state('Voice output उपलब्ध नाही. पुन्हा बोलू शकता.');setTimeout(startRecognition,350);}
  });
  window.addEventListener('vandira:tts-end',()=>{if(active){state('पुढचा प्रश्न ऐकू येत आहे…');setTimeout(startRecognition,350);}});
  window.addEventListener('vandira:tts-error',()=>{if(active){state('Voice उत्तरात अडचण आली. पुन्हा ऐकू येत आहे…');setTimeout(startRecognition,350);}});
  window.addEventListener('beforeunload',()=>{active=false;stopRecognition();});
  window.VANDIRA_TWO_WAY_VOICE={supported:!!SR,isActive:()=>active,start:()=>{if(!active)toggle();},stop:()=>{if(active)toggle()}};
})();
