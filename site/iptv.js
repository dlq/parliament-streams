(() => {
  const hosts = document.querySelectorAll('[data-iptv]');
  if (!hosts.length) return;
  const keys = ['title', 'intro', 'stable', 'broader', 'guide', 'note', 'copy', 'copied', 'failed'];
  const rows = {
    en: ['Use in an IPTV app', 'Paste a playlist URL into your player. Add the XMLTV URL as its guide / EPG.', 'Always-on playlist', 'Broader playlist', 'XMLTV programme guide', 'The broader playlist includes sitting-only streams. Guide coverage is partial; some channels have no listings.', 'Copy URL', 'URL copied.', 'Copy unavailable. The URL is selected for you to copy manually.'],
    fr: ['Utiliser dans une application IPTV', 'Collez une URL de liste dans votre lecteur. Ajoutez l’URL XMLTV comme guide / EPG.', 'Liste des chaînes en continu', 'Liste élargie', 'Guide des programmes XMLTV', 'La liste élargie comprend des flux actifs pendant les séances. Le guide est partiel : certaines chaînes n’ont aucune programmation.', 'Copier l’URL', 'URL copiée.', 'Copie indisponible. L’URL est sélectionnée pour une copie manuelle.'],
    es: ['Usar en una aplicación IPTV', 'Pega una URL de lista en tu reproductor. Añade la URL XMLTV como guía / EPG.', 'Lista de emisión continua', 'Lista ampliada', 'Guía de programas XMLTV', 'La lista ampliada incluye emisiones durante las sesiones. La guía es parcial; algunos canales no tienen programación.', 'Copiar URL', 'URL copiada.', 'No se puede copiar. La URL está seleccionada para copiarla manualmente.'],
    'pt-BR': ['Usar em um aplicativo IPTV', 'Cole a URL de uma lista no seu reprodutor. Adicione a URL XMLTV como guia / EPG.', 'Lista de transmissão contínua', 'Lista ampliada', 'Guia de programação XMLTV', 'A lista ampliada inclui transmissões durante as sessões. O guia é parcial; alguns canais não têm programação.', 'Copiar URL', 'URL copiada.', 'Cópia indisponível. A URL está selecionada para copiar manualmente.'],
    da: ['Brug i en IPTV-app', 'Indsæt en spilleliste-URL i din afspiller. Tilføj XMLTV-URL’en som programguide / EPG.', 'Spilleliste med faste udsendelser', 'Udvidet spilleliste', 'XMLTV-programguide', 'Den udvidede liste omfatter udsendelser under møder. Guiden er delvis; nogle kanaler har ingen programoplysninger.', 'Kopiér URL', 'URL kopieret.', 'Kan ikke kopiere. URL’en er markeret til manuel kopiering.'],
    de: ['In einer IPTV-App verwenden', 'Fügen Sie eine Wiedergabelisten-URL in Ihren Player ein. Nutzen Sie die XMLTV-URL als Programmführer / EPG.', 'Liste durchgehend sendender Kanäle', 'Erweiterte Wiedergabeliste', 'XMLTV-Programmführer', 'Die erweiterte Liste enthält sitzungsabhängige Streams. Der Programmführer ist unvollständig; manche Kanäle haben keine Einträge.', 'URL kopieren', 'URL kopiert.', 'Kopieren nicht verfügbar. Die URL ist zum manuellen Kopieren markiert.'],
    et: ['Kasuta IPTV-rakenduses', 'Kleebi esitusloendi URL mängijasse. Lisa XMLTV URL saatekavaks / EPG-ks.', 'Pideva ülekande esitusloend', 'Laiendatud esitusloend', 'XMLTV saatekava', 'Laiendatud loend sisaldab istungiaegseid ülekandeid. Saatekava on osaline; mõnel kanalil pole kirjeid.', 'Kopeeri URL', 'URL kopeeritud.', 'Kopeerimine pole saadaval. URL on käsitsi kopeerimiseks valitud.'],
    el: ['Χρήση σε εφαρμογή IPTV', 'Επικολλήστε μια διεύθυνση λίστας στον αναπαραγωγέα. Προσθέστε τη διεύθυνση XMLTV ως οδηγό / EPG.', 'Λίστα συνεχούς μετάδοσης', 'Εκτεταμένη λίστα', 'Οδηγός προγράμματος XMLTV', 'Η εκτεταμένη λίστα περιλαμβάνει μεταδόσεις συνεδριάσεων. Ο οδηγός είναι μερικός· ορισμένα κανάλια δεν έχουν καταχωρίσεις.', 'Αντιγραφή URL', 'Η διεύθυνση αντιγράφηκε.', 'Η αντιγραφή δεν είναι διαθέσιμη. Η διεύθυνση επιλέχθηκε για χειροκίνητη αντιγραφή.'],
    hi: ['IPTV ऐप में उपयोग करें', 'अपने प्लेयर में प्लेलिस्ट URL पेस्ट करें। XMLTV URL को गाइड / EPG के रूप में जोड़ें।', 'निरंतर प्रसारण की प्लेलिस्ट', 'विस्तृत प्लेलिस्ट', 'XMLTV कार्यक्रम गाइड', 'विस्तृत सूची में केवल सत्र के दौरान चलने वाली स्ट्रीम भी हैं। गाइड आंशिक है; कुछ चैनलों की सूची उपलब्ध नहीं है।', 'URL कॉपी करें', 'URL कॉपी हो गया।', 'कॉपी उपलब्ध नहीं है। मैन्युअल कॉपी के लिए URL चुना गया है।'],
    ga: ['Úsáid in aip IPTV', 'Greamaigh URL seinnliosta i do sheinnteoir. Cuir URL XMLTV leis mar threoir / EPG.', 'Seinnliosta leanúnach', 'Seinnliosta leathnaithe', 'Treoir clár XMLTV', 'Tá sruthanna a bhíonn ar fáil le linn suí sa liosta leathnaithe. Tá an treoir neamhiomlán; níl liostaí ag roinnt cainéal.', 'Cóipeáil URL', 'URL cóipeáilte.', 'Ní féidir cóipeáil. Tá an URL roghnaithe le cóipeáil de láimh.'],
    it: ['Usa in un’app IPTV', 'Incolla un URL della playlist nel lettore. Aggiungi l’URL XMLTV come guida / EPG.', 'Playlist di trasmissioni continue', 'Playlist estesa', 'Guida programmi XMLTV', 'La playlist estesa include flussi attivi durante le sedute. La guida è parziale; alcuni canali non hanno programmi elencati.', 'Copia URL', 'URL copiato.', 'Copia non disponibile. L’URL è selezionato per la copia manuale.'],
    lb: ['An enger IPTV-App benotzen', 'Setzt eng Playlist-URL an Äre Player. Füügt d’XMLTV-URL als Programmguide / EPG bäi.', 'Playlist mat permanente Sendungen', 'Erweidert Playlist', 'XMLTV-Programmguide', 'Déi erweidert Lëscht enthält Sëtzungsstreams. De Guide ass deelweis; verschidde Kanäl hu keng Programmdonnéeën.', 'URL kopéieren', 'URL kopéiert.', 'Kopéieren net disponibel. D’URL ass fir manuell Kopéieren ausgewielt.'],
    nl: ['Gebruiken in een IPTV-app', 'Plak een afspeellijst-URL in je speler. Voeg de XMLTV-URL toe als programmagids / EPG.', 'Afspeellijst met doorlopende uitzendingen', 'Uitgebreide afspeellijst', 'XMLTV-programmagids', 'De uitgebreide lijst bevat ook streams tijdens vergaderingen. De gids is gedeeltelijk; sommige kanalen hebben geen vermeldingen.', 'URL kopiëren', 'URL gekopieerd.', 'Kopiëren niet beschikbaar. De URL is geselecteerd om handmatig te kopiëren.'],
    nb: ['Bruk i en IPTV-app', 'Lim inn en spilleliste-URL i spilleren. Legg til XMLTV-URL-en som programguide / EPG.', 'Spilleliste med kontinuerlige sendinger', 'Utvidet spilleliste', 'XMLTV-programguide', 'Den utvidede listen inkluderer sendinger under møter. Guiden er delvis; noen kanaler har ingen oppføringer.', 'Kopier URL', 'URL kopiert.', 'Kopiering er ikke tilgjengelig. URL-en er valgt for manuell kopiering.'],
    sk: ['Použiť v aplikácii IPTV', 'Vložte URL zoznamu do prehrávača. Pridajte URL XMLTV ako programového sprievodcu / EPG.', 'Zoznam nepretržitých vysielaní', 'Rozšírený zoznam', 'Programový sprievodca XMLTV', 'Rozšírený zoznam obsahuje prenosy počas zasadnutí. Sprievodca je čiastočný; niektoré kanály nemajú program.', 'Kopírovať URL', 'URL skopírovaná.', 'Kopírovanie nie je dostupné. URL je vybratá na ručné kopírovanie.'],
    th: ['ใช้ในแอป IPTV', 'วาง URL เพลย์ลิสต์ในเครื่องเล่น แล้วเพิ่ม URL XMLTV เป็นผังรายการ / EPG', 'เพลย์ลิสต์ช่องที่ออกอากาศต่อเนื่อง', 'เพลย์ลิสต์เพิ่มเติม', 'ผังรายการ XMLTV', 'รายการเพิ่มเติมมีสตรีมที่ออกอากาศเฉพาะช่วงประชุม ผังรายการยังไม่ครบ บางช่องไม่มีข้อมูลรายการ', 'คัดลอก URL', 'คัดลอก URL แล้ว', 'ไม่สามารถคัดลอกได้ เลือก URL ไว้ให้คัดลอกด้วยตนเองแล้ว'],
    'zh-Hans': ['在 IPTV 应用中使用', '将播放列表 URL 粘贴到播放器，并将 XMLTV URL 添加为节目指南 / EPG。', '全天播出播放列表', '扩展播放列表', 'XMLTV 节目指南', '扩展列表包含仅在会议期间播出的流。节目指南覆盖不完整；部分频道没有节目记录。', '复制 URL', 'URL 已复制。', '无法复制。已选中 URL，请手动复制。'],
    'iu-Cans': ['IPTV ᐊᑐᕐᓗᒍ', 'ᐱᙳᐊᕈᑎᓐᓄᑦ URL ᐃᓕᓗᒍ. XMLTV URL ᐃᓕᓗᒍ EPG ᐊᑐᕐᓗᒍ.', 'ᑲᔪᓯᔪᑦ ᑎᑎᖅᓯᒪᔪᑦ', 'ᐃᓚᒋᐊᖅᑕᐅᔪᑦ ᑎᑎᖅᓯᒪᔪᑦ', 'XMLTV ᐱᓕᕆᐊᑦ ᖃᐅᔨᒋᐊᕈᑎ', 'ᐃᓚᖏᑦ ᑲᑎᒪᓕᕌᖓᑕ ᑭᓯᐊᓂ ᓴᖅᑭᑕᐅᓲᑦ. ᐃᓚᖏᑦ ᖃᐅᔨᒋᐊᕈᑎᖃᙱᑦᑐᑦ.', 'URL ᐊᔾᔨᓕᐅᕐᓗᒍ', 'URL ᐊᔾᔨᓕᐊᖑᔪᖅ.', 'URL ᓂᕈᐊᖅᑕᐅᔪᖅ. ᐊᔾᔨᓕᐅᕐᓗᒍ.'],
    mi: ['Whakamahia ki tētahi taupānga IPTV', 'Whakapirihia he URL rārangipāpāho ki tō pūpāpāho. Tāpirihia te URL XMLTV hei aratohu / EPG.', 'Rārangi pāpāho pūmau', 'Rārangi pāpāho whānui', 'Aratohu hōtaka XMLTV', 'Kei te rārangi whānui ngā roma wā hui anake. He wāhanga noa te aratohu; kāore he hōtaka mō ētahi hongere.', 'Tārua URL', 'Kua tāruatia te URL.', 'Kāore e taea te tārua. Kua tīpakohia te URL hei tārua ā-ringa.'],
  };
  const { supportedLocale } = window.ParliamentStreamsI18n;
  const urls = ['stable-hls.m3u8', 'validated-hls.m3u8', 'epg.xml'].map((name) => `https://dlq.ca/parliament-streams/data/${name}`);
  const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  function render() {
    const locale = supportedLocale(document.querySelector('#locale-select').value || new URLSearchParams(location.search).get('lang') || localStorage.getItem('parliament-streams-locale') || navigator.language);
    const messages = Object.fromEntries(keys.map((key, index) => [key, (rows[locale] ?? rows.en)[index]]));
    hosts.forEach((host) => {
      const open = host.querySelector('details')?.open ?? false;
      host.innerHTML = `<details class="iptv-disclosure"${open ? ' open' : ''} lang="${locale}">
        <summary>${messages.title}</summary>
        <div class="iptv-content"><p>${messages.intro}</p>
        <div class="iptv-links">${['stable', 'broader', 'guide'].map((key, index) => `<div class="iptv-resource">
          <label for="iptv-${key}"><a href="${urls[index]}" target="_blank" rel="noreferrer">${messages[key]} <span aria-hidden="true">↗</span></a></label>
          <div class="iptv-copy-row"><input id="iptv-${key}" type="text" readonly value="${urls[index]}" aria-label="${escape(messages[key])} URL" spellcheck="false"><button type="button" data-copy="${index}" aria-label="${escape(messages.copy)}: ${escape(messages[key])}">${messages.copy}</button></div>
        </div>`).join('')}</div>
        <p>${messages.note}</p>
        <details class="iptv-vlc" lang="en"><summary>VLC desktop instructions (English)</summary>
          <ol><li>Copy either playlist URL above.</li><li>In VLC, choose <strong>Media → Open Network Stream</strong> (Windows/Linux) or <strong>File → Open Network</strong> (macOS).</li><li>Paste the URL, choose <strong>Play</strong> or <strong>Open</strong>, then select a channel in VLC’s playlist.</li></ol>
          <p>Use the playlist URL for VLC playback. The XMLTV URL is a separate guide feed for apps that support XMLTV; these VLC steps do not configure an XMLTV guide.</p>
          <a href="https://docs.videolan.me/vlc-user/desktop/3.0/en/basic/media.html" target="_blank" rel="noreferrer">VideoLAN’s official VLC documentation ↗</a>
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
  document.querySelector('#locale-select').addEventListener('change', render);
})();
