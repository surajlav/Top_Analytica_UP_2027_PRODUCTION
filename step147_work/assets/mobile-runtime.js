/* VANDIRA STEP143 — mobile/WebView runtime. No election data mutation. */
(function () {
  'use strict';
  function setNetworkState() {
    document.documentElement.classList.toggle('is-offline', !navigator.onLine);
    let bar = document.querySelector('[data-vandira-network-status]');
    if (!bar) {
      bar = document.createElement('div');
      bar.setAttribute('data-vandira-network-status', '');
      bar.setAttribute('role', 'status');
      bar.setAttribute('aria-live', 'polite');
      bar.textContent = 'ऑफलाइन मोड — live intelligence उपलब्ध होण्यासाठी इंटरनेट कनेक्शन आवश्यक आहे.';
      document.body.prepend(bar);
    }
    bar.hidden = navigator.onLine;
  }
  function registerSW() {
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(function () {});
    }
  }
  function markExternalLinks() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      const href = a.getAttribute('href') || '';
      if (/^(https?:|mailto:|tel:|whatsapp:)/i.test(href)) {
        a.setAttribute('rel', 'noopener noreferrer');
        // Preserve explicit target behavior; native WebView shells can choose how to open it.
      }
    });
  }
  window.addEventListener('online', setNetworkState);
  window.addEventListener('offline', setNetworkState);
  document.addEventListener('DOMContentLoaded', function () {
    setNetworkState();
    markExternalLinks();
    registerSW();
  });
})();
