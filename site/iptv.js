(() => {
const controllerReady = window.ParliamentStreamsPageReady;
window.ParliamentStreamsPageReady = window.ParliamentStreamsI18n.startPage(async (pageSignal) => {
  await controllerReady;
  if (pageSignal?.aborted) return;
  const hosts = document.querySelectorAll('[data-iptv]');
  if (!hosts.length) return;
  const urls = ['stable-hls.m3u', 'validated-hls.m3u', 'epg.xml'].map((name) => `https://dlq.ca/parliament-streams/data/${name}`);
  const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  function render() {
    const locale = window.ParliamentStreamsPageLocale.current();
    const messages = window.ParliamentStreamsI18n.data(locale, "iptv");
    hosts.forEach((host) => {
      const open = host.querySelector('details')?.open ?? false;
      const vlcOpen = host.querySelector('.iptv-vlc')?.open ?? false;
      host.innerHTML = `<details class="iptv-disclosure"${open ? ' open' : ''} lang="${locale}">
        <summary>${messages.title}</summary>
        <div class="iptv-content"><p>${messages.intro}</p>
        <p class="iptv-scope">${messages.filterScope}</p>
        <div class="iptv-links">${['stable', 'broader', 'guide'].map((key, index) => `<div class="iptv-resource">
          <label for="iptv-${key}"><a href="${urls[index]}" target="_blank" rel="noreferrer">${messages[key]} <span aria-hidden="true">↗</span></a></label>
          <div class="iptv-copy-row"><input id="iptv-${key}" type="text" readonly value="${urls[index]}" aria-label="${escape(messages[key])} URL" spellcheck="false"><button type="button" data-copy="${index}" aria-label="${escape(messages.copy)}: ${escape(messages[key])}">${messages.copy}</button></div>
        </div>`).join('')}</div>
        <p>${messages.note}</p>
        <details class="iptv-vlc"${vlcOpen ? ' open' : ''} lang="${locale}"><summary>${messages.vlcTitle}</summary>
          <ol><li>${messages.vlcCopy}</li><li>${messages.vlcOpen}</li><li>${messages.vlcPlay}</li></ol>
          <p>${messages.vlcGuide}</p>
          <a href="https://docs.videolan.me/vlc-user/desktop/3.0/en/basic/media.html" hreflang="en" target="_blank" rel="noreferrer">${messages.vlcDocs} ↗</a>
        </details>
        <p class="iptv-feedback" role="status" aria-live="polite" aria-atomic="true"></p></div>
      </details>`;
      host.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', async () => {
        const index = Number(button.dataset.copy);
        const input = host.querySelector(`#iptv-${['stable', 'broader', 'guide'][index]}`);
        const feedback = host.querySelector('.iptv-feedback');
        feedback.textContent = '';
        button.disabled = true;
        try {
          await navigator.clipboard.writeText(urls[index]);
          feedback.textContent = `${messages[['stable', 'broader', 'guide'][index]]}: ${messages.copied}`;
        } catch {
          input.focus();
          input.select();
          feedback.textContent = messages.failed;
        } finally {
          button.disabled = false;
        }
      }));
    });
  }
  render();
  document.addEventListener('parliament:localechange', render, pageSignal ? { signal: pageSignal } : {});
});
})();
