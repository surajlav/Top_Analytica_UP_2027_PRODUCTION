(function(){
  'use strict';
  const input=document.getElementById('ai-input');
  const send=document.getElementById('ai-send');
  if(!input||!send) return;

  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  const LANG_MAP={auto:'hi-IN',hi:'hi-IN',en:'en-IN',mr:'mr-IN',te:'te-IN',ta:'ta-IN',bn:'bn-IN',gu:'gu-IN',kn:'kn-IN',ml:'ml-IN',pa:'pa-IN',or:'or-IN',as:'as-IN'};
  const KEY='vandiraVoiceInputV1';
  let recognition=null, listening=false, baseText='', interim='';

  const button=document.createElement('button');
  button.type='button';
  button.className='ai-voice-input';
  button.id='ai-voice-input';
  button.setAttribute('aria-label','हिंदी में बोलकर प्रश्न लिखें');
  button.title='हिंदी में बोलकर प्रश्न लिखें';
  button.innerHTML='<span aria-hidden="true">●</span><span class="ai-voice-label">बोला हुआ प्रश्न</span>';
  send.parentNode.insertBefore(button,send);

  const status=document.createElement('div');
  status.className='ai-voice-status';
  status.id='ai-voice-status';
  status.setAttribute('aria-live','polite');
  button.parentNode.parentNode.insertBefore(status,button.parentNode.nextSibling);

  function currentLang(){
    const selected=document.documentElement.getAttribute('data-ai-lang')||localStorage.getItem('taAiLanguage')||'hi';
    return LANG_MAP[selected]||'hi-IN';
  }
  function saveEvent(type){
    try{
      const data=JSON.parse(localStorage.getItem(KEY)||'[]');
      data.push({type,language:currentLang(),timestamp:new Date().toISOString()});
      localStorage.setItem(KEY,JSON.stringify(data.slice(-20)));
    }catch(_e){}
  }
  function setState(on){
    listening=on; button.classList.toggle('listening',on); button.setAttribute('aria-pressed',String(on));
    status.textContent=on?'ऐकू येत आहे… बोलणे पूर्ण झाल्यावर थांबवा.':'';
    button.title=on?'बोलणे थांबवा':'हिंदी में बोलकर प्रश्न लिखें';
  }
  function appendTranscript(){
    const combined=(baseText+(baseText&&interim?' ':'')+interim).trim();
    input.value=combined; input.dispatchEvent(new Event('input',{bubbles:true}));
  }
  function stop(){try{recognition&&recognition.stop();}catch(_e){} setState(false);}
  function start(){
    if(!SpeechRecognition){
      status.textContent='या ब्राउझरमध्ये voice input उपलब्ध नाही. Chrome/Edge सारखा समर्थित ब्राउझर वापरा.';
      return;
    }
    if(listening){stop();return;}
    recognition=new SpeechRecognition();
    recognition.lang=currentLang();
    recognition.continuous=false;
    recognition.interimResults=true;
    recognition.maxAlternatives=1;
    baseText=input.value.trim(); interim='';
    recognition.onstart=()=>{setState(true);saveEvent('start');};
    recognition.onresult=(event)=>{
      interim='';
      for(let i=event.resultIndex;i<event.results.length;i++){
        const text=event.results[i][0]?.transcript||'';
        if(event.results[i].isFinal){baseText=(baseText+(baseText?' ':'')+text).trim();}
        else interim+=text;
      }
      appendTranscript();
    };
    recognition.onerror=(event)=>{
      const map={'not-allowed':'मायक्रोफोनची परवानगी नाकारली आहे.','service-not-allowed':'Voice service उपलब्ध नाही.','no-speech':'आवाज ऐकू आला नाही.','audio-capture':'मायक्रोफोन उपलब्ध नाही.','network':'Voice recognition साठी network आवश्यक आहे.'};
      status.textContent=map[event.error]||'Voice input मध्ये अडचण आली.';
      saveEvent('error:'+event.error);
      setState(false);
    };
    recognition.onend=()=>{setState(false);if(interim){baseText=(baseText+(baseText?' ':'')+interim).trim();interim='';appendTranscript();}saveEvent('end');};
    try{recognition.start();}catch(_e){setState(false);status.textContent='Voice input सुरू करता आले नाही.';}
  }
  button.addEventListener('click',start);
  window.addEventListener('beforeunload',stop);
})();
