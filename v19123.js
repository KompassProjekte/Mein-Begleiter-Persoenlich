"use strict";
(() => {
  const MODUS_KEY = "mein-begleiter-persoenlich-v1-9-1-ansicht";
  const vollSeiten = new Set(["bericht", "kosten", "verlauf", "drucken"]);
  const de = (s) => String(s || "").localeCompare(String(s || ""), "de");
  const nav = document.querySelector(".seitenleiste .nav");
  const mobilListe = document.querySelector("#v19121MobilMenue .v19121-menuliste");

  function navKnopf(seite, symbol, text, mobil = false) {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.seite = seite;
    if (!mobil) { b.className = "nav-knopf"; b.innerHTML = `<span class="symbol">${symbol}</span>${text}`; }
    else b.textContent = `${symbol} ${text}`;
    b.addEventListener("click", () => { document.getElementById("v19121MobilMenue")?.close(); wechsleSeite(seite); });
    return b;
  }

  if (nav && !nav.querySelector('[data-seite="drucken"]')) {
    const b = navKnopf("drucken", "🖨", "Drucken");
    const vor = nav.querySelector('[data-seite="sicherung"]');
    nav.insertBefore(b, vor || null);
  }
  if (mobilListe && !mobilListe.querySelector('[data-seite="drucken"]')) {
    const b = navKnopf("drucken", "🖨", "Drucken", true);
    const vor = mobilListe.querySelector('[data-seite="sicherung"]');
    mobilListe.insertBefore(b, vor || null);
  }
  document.querySelectorAll('[data-seite]').forEach(b => b.classList.toggle("v19123-nur-voll", vollSeiten.has(b.dataset.seite)));

  const einstellungen = document.getElementById("seite-einstellungen");
  const ansichtBox = einstellungen?.querySelector(".v19121-ansicht");
  if (ansichtBox) {
    ansichtBox.querySelectorAll("[data-ansicht]").forEach(b => {
      b.classList.add("v19123-ansicht-knopf");
      b.innerHTML = `<span class="v19123-check">✓</span>${b.dataset.ansicht === "voll" ? "Vollständige Ansicht" : "Einfache Ansicht"}`;
    });
    const status = document.createElement("div"); status.className = "v19123-ansicht-status"; status.setAttribute("aria-live", "polite"); ansichtBox.after(status);
    const anwenden = (modus, melden = false) => {
      modus = modus === "voll" ? "voll" : "einfach";
      localStorage.setItem(MODUS_KEY, modus);
      document.documentElement.classList.toggle("v19123-einfach", modus === "einfach");
      document.documentElement.classList.toggle("v186-einfach", modus === "einfach");
      document.querySelectorAll("[data-ansicht]").forEach(b => { const aktiv = b.dataset.ansicht === modus; b.classList.toggle("aktiv", aktiv); b.setAttribute("aria-pressed", String(aktiv)); });
      status.textContent = `Aktuelle Ansicht: ${modus === "voll" ? "Vollständige Ansicht" : "Einfache Ansicht"}`;
      if (modus === "einfach" && document.querySelector(".seite.aktiv")?.id.replace("seite-", "") && vollSeiten.has(document.querySelector(".seite.aktiv").id.replace("seite-", ""))) wechsleSeite("cockpit");
      if (melden) toast("Ansicht geändert. Ihre Daten bleiben vollständig erhalten.");
    };
    ansichtBox.addEventListener("click", e => { const b = e.target.closest("[data-ansicht]"); if (!b) return; e.preventDefault(); e.stopImmediatePropagation(); anwenden(b.dataset.ansicht, true); }, true);
    anwenden(localStorage.getItem(MODUS_KEY) || "einfach");
  }

  // Gemeinsame professionelle Terminfilterleiste
  const altFilter = document.querySelector("#seite-termine .uebersicht-filter");
  if (altFilter) {
    altFilter.className = "v19123-filterleiste";
    altFilter.innerHTML = `<label>Welche Termine?<select class="filter" id="v19123TerminArt"><option value="kommend">Kommende Termine</option><option value="vergangen">Vergangene Termine</option><option value="alle">Alle Termine</option></select></label><label>Zeitraum<select class="filter" id="v19123TerminZeitraum"><option value="30">Nächste 30 Tage</option><option value="3m">Nächste 3 Monate</option><option value="-3m">Letzte 3 Monate</option><option value="jahr">Dieses Jahr</option><option value="eigen">Eigener Zeitraum</option><option value="gesamt">Gesamter Zeitraum</option></select></label><label class="v19123-eigen">Von<input class="filter" id="terminVon" type="date"></label><label class="v19123-eigen">Bis<input class="filter" id="terminBis" type="date"></label><label>Arzt / Stelle<select class="filter" id="terminArztFilter"><option value="">Alle Ärzte / Stellen</option></select></label><button class="knopf klein sekundaer" id="terminFilterReset" type="button">Filter zurücksetzen</button>`;
    const art = document.getElementById("v19123TerminArt"), zeitraum = document.getElementById("v19123TerminZeitraum"), von = document.getElementById("terminVon"), bis = document.getElementById("terminBis");
    const plusMonate = n => { const d = new Date(heuteIso() + "T12:00:00"); d.setMonth(d.getMonth() + n); return d.toLocaleDateString("sv-SE"); };
    const plusTage = n => { const d = new Date(heuteIso() + "T12:00:00"); d.setDate(d.getDate() + n); return d.toLocaleDateString("sv-SE"); };
    const zeitraumAnwenden = () => {
      const z = zeitraum.value, h = heuteIso();
      document.querySelectorAll(".v19123-eigen").forEach(x => x.hidden = z !== "eigen");
      if (z === "30") { von.value = h; bis.value = plusTage(30); }
      else if (z === "3m") { von.value = h; bis.value = plusMonate(3); }
      else if (z === "-3m") { von.value = plusMonate(-3); bis.value = h; }
      else if (z === "jahr") { von.value = h.slice(0,4)+"-01-01"; bis.value = h.slice(0,4)+"-12-31"; }
      else if (z === "gesamt") { von.value = ""; bis.value = ""; }
    };
    const basis = renderTermine;
    renderTermine = function() {
      const r = basis.apply(this, arguments);
      const a = art.value;
      const kommend = document.getElementById("termineKommend")?.closest("article");
      const vergangen = document.getElementById("termineVergangen")?.closest("article");
      const fragen = document.getElementById("fragenListe")?.closest("article");
      if (kommend) kommend.hidden = a === "vergangen";
      if (vergangen) vergangen.hidden = a === "kommend";
      if (fragen) fragen.hidden = a === "vergangen";
      return r;
    };
    const refresh = () => { zeitraumAnwenden(); renderTermine(); };
    [art, zeitraum, von, bis, document.getElementById("terminArztFilter")].forEach(x => x?.addEventListener("change", refresh));
    document.getElementById("terminFilterReset").addEventListener("click", () => { art.value="kommend"; zeitraum.value="3m"; document.getElementById("terminArztFilter").value=""; refresh(); });
    zeitraum.value = "3m"; refresh();
  }

  // Druckzentrum
  const druck = document.createElement("section"); druck.className = "seite"; druck.id = "seite-drucken";
  druck.innerHTML = `<button class="knopf sekundaer zur-uebersicht" type="button" data-zur>← Zur Übersicht</button><div class="v19121-seitenkopf"><div><h2>Druckzentrum</h2><p>Wählen Sie genau den Inhalt aus, den Sie drucken oder als PDF speichern möchten.</p></div></div><article class="karte"><h3>Was möchten Sie drucken?</h3><div class="v19123-druckauswahl" id="v19123Druckarten"></div><div class="v19123-druckfilter"><label>Von<input class="filter" id="v19123DruckVon" type="date"></label><label>Bis<input class="filter" id="v19123DruckBis" type="date"></label><label>Arzt / Stelle<select class="filter" id="v19123DruckArzt"><option value="">Alle Ärzte / Stellen</option></select></label><label>Druckdichte<select class="filter" id="v19123Dichte"><option value="lesbar">Gut lesbar – empfohlen</option><option value="sparsam">Papiersparend</option></select></label></div><label id="v19123EinzelLabel"><input id="v19123Einzel" type="checkbox"> Einzelposten zusätzlich ausgeben</label><div id="v19123DiagrammBox" hidden><h4>Diagramme auswählen</h4><div class="v19123-diagrammauswahl" id="v19123Diagramme"></div></div><div class="v19123-druckaktionen"><button class="knopf" type="button" id="v19123Vorschau">Vorschau aktualisieren</button><button class="knopf sekundaer" type="button" id="v19123Drucken">🖨 Drucken</button><button class="knopf sekundaer" type="button" id="v19123Pdf">Als PDF speichern</button></div><p class="hinweis">Beim PDF-Speichern wählen Sie im Druckdialog des Browsers „Als PDF speichern“.</p></article><article class="v19123-vorschau" id="v19123DruckVorschau" aria-live="polite"></article>`;
  document.querySelector("main").appendChild(druck);
  druck.querySelector("[data-zur]").addEventListener("click", () => wechsleSeite("cockpit"));
  const arten = [["fragen","Offene Fragen"],["kommend","Kommende Termine"],["vergangen","Vergangene Termine"],["alletermine","Alle Termine"],["medikamente","Medikamentenplan"],["behandlung","Behandlungsübersicht"],["nebenwirkungen","Beobachtete Nebenwirkungen"],["schritte","Behandlungsschritte"],["dokumente","Dokumentenverzeichnis"],["kosten","Kostenübersicht"],["verlauf","Verlauf"],["diagramme","Ausgewählte Diagramme"],["tagebuch","Tagebuch"],["buch","Persönliches Buch"]];
  document.getElementById("v19123Druckarten").innerHTML = arten.map((a,i)=>`<label><input type="radio" name="v19123-art" value="${a[0]}" ${i===0?"checked":""}> ${a[1]}</label>`).join("");
  const diagramme = [["chartBefinden","Befinden"],["chartSchmerz","Schmerz"],["chartEnergie","Energie"],["chartSchlaf","Schlaf"],["chartGewicht","Gewicht"],["chartTemperatur","Körpertemperatur"],["chartBlutdruck","Blutdruck"],["chartPuls","Puls"],["chartSpo2","Sauerstoffsättigung"],["chartBlutzucker","Blutzucker"],["chartAtemfrequenz","Atemfrequenz"]];
  document.getElementById("v19123Diagramme").innerHTML = diagramme.map((d,i)=>`<label><input type="checkbox" value="${d[0]}" ${i<4?"checked":""}> ${d[1]}</label>`).join("");
  const artWert=()=>document.querySelector('[name="v19123-art"]:checked')?.value||"fragen";
  const zeitraumPasst=e=>{const v=document.getElementById("v19123DruckVon").value||"0000-01-01",b=document.getElementById("v19123DruckBis").value||"9999-12-31";return e.datum&&e.datum>=v&&e.datum<=b;};
  const arztPasst=e=>{const a=document.getElementById("v19123DruckArzt").value;return !a||String(e.arzt||e.stelle||"")===a;};
  const kopf=t=>`<h2>${esc(t)} – ${datumLang(heuteIso())}</h2><div class="v19123-druckmeta">Erstellt: ${datumLang(heuteIso())}${document.getElementById("v19123DruckVon").value||document.getElementById("v19123DruckBis").value?" · "+zeitraumText(document.getElementById("v19123DruckVon").value,document.getElementById("v19123DruckBis").value):""}</div>`;
  const tabelle=(spalten,zeilen)=>zeilen.length?`<table class="v19123-druckliste"><thead><tr>${spalten.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${zeilen.join("")}</tbody></table>`:`<div class="v19123-leer">Keine passenden Daten vorhanden.</div>`;
  const terminZeile=e=>`<tr><td>${datumLang(e.datum)}${e.messUhrzeit?`<br>${esc(e.messUhrzeit)} Uhr`:""}</td><td>${esc(e.arzt||"")}</td><td>${esc(e.massnahme||e.bemerkung||"")}</td><td>${esc(terminStatus(e))}</td></tr>`;
  const vorschau=()=>{
    const art=artWert(), out=document.getElementById("v19123DruckVorschau"); let html="", titel=arten.find(x=>x[0]===art)?.[1]||"Ausdruck";
    if(art==="fragen"){const f=daten.fragen.filter(x=>!x.erledigt).filter(arztPasst);html=tabelle(["Arzt / Stelle","Offene Frage"],f.map(x=>`<tr><td>${esc(x.arzt||"Allgemein")}</td><td>${esc(x.text)}</td></tr>`));}
    else if(["kommend","vergangen","alletermine"].includes(art)){let x=alleTermine().filter(zeitraumPasst).filter(arztPasst);if(art==="kommend")x=x.filter(istKommenderTermin);if(art==="vergangen")x=x.filter(e=>!istKommenderTermin(e));x.sort((a,b)=>zeitSchluessel(a).localeCompare(zeitSchluessel(b)));html=tabelle(["Datum","Arzt / Stelle","Termin","Status"],x.map(terminZeile));}
    else if(art==="medikamente"){html=tabelle(["Medikament","Anwendung","Abstand"],daten.medikamente.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.anwendung||m.zeit||"")}</td><td>${m.abstand?esc(m.abstand+" "+(m.einheit||"Tage")):""}</td></tr>`));}
    else if(art==="nebenwirkungen"){html=tabelle(["Datum","Medikament","Beobachtung"],daten.nebenwirkungen.filter(zeitraumPasst).map(n=>`<tr><td>${datumLang(n.datum)}</td><td>${esc(n.medName||"")}</td><td>${esc(n.beschwerde)}</td></tr>`));}
    else if(art==="schritte"){html=tabelle(["Datum","Behandlungsschritt","Ort / Stelle","Status"],daten.schritte.filter(zeitraumPasst).map(s=>`<tr><td>${datumLang(s.datum)}</td><td>${esc(s.titel||s.name||s.massnahme||"")}</td><td>${esc(s.ort||s.stelle||s.arzt||"")}</td><td>${esc(s.status||"")}</td></tr>`));}
    else if(art==="behandlung"){const m=tabelle(["Medikament","Anwendung"],daten.medikamente.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.anwendung||x.zeit||"")}</td></tr>`));const s=tabelle(["Datum","Behandlungsschritt","Status"],daten.schritte.filter(zeitraumPasst).map(x=>`<tr><td>${datumLang(x.datum)}</td><td>${esc(x.titel||x.name||x.massnahme||"")}</td><td>${esc(x.status||"")}</td></tr>`));html=`<h3>Medikamentenplan</h3>${m}<h3>Behandlungsschritte</h3>${s}`;}
    else if(art==="dokumente"){const x=[...dokumenteGeschichte].filter(zeitraumPasst).sort((a,b)=>(b.datum||"").localeCompare(a.datum||""));html=tabelle(["Datum","Dokument","Kategorie","Seiten"],x.map(d=>`<tr><td>${datumLang(d.datum)}</td><td>${esc(d.name||"Dokument")}</td><td>${esc(d.kategorie||"Sonstiges")}</td><td>${d.seiten?.length||1}</td></tr>`));}
    else if(art==="kosten"){const x=daten.eintraege.filter(zeitraumPasst),sum=f=>x.reduce((a,e)=>a+(Number(e[f])||0),0),r=sum("rechnung"),z=sum("rezept"),f=sum("fahrt");html=`<div class="v19123-kosten"><div>Rechnungen<strong>${euro(r)}</strong></div><div>Rezepte<strong>${euro(z)}</strong></div><div>Fahrten<strong>${euro(f)}</strong></div><div>Gesamt<strong>${euro(r+z+f)}</strong></div></div><h3>Verteilung nach Kostenart</h3><p>Rechnungen ${euro(r)} · Rezepte ${euro(z)} · Fahrten ${euro(f)}</p>`;if(document.getElementById("v19123Einzel").checked)html+=tabelle(["Datum","Art","Betrag"],x.flatMap(e=>[["rechnung","Rechnung"],["rezept","Rezept"],["fahrt","Fahrt"]].filter(a=>Number(e[a[0]])).map(a=>`<tr><td>${datumLang(e.datum)}</td><td>${a[1]}</td><td>${euro(e[a[0]])}</td></tr>`)));}
    else if(art==="diagramme"||art==="verlauf"){renderAlles();const ids=art==="verlauf"?diagramme.map(x=>x[0]):[...document.querySelectorAll("#v19123Diagramme input:checked")].map(x=>x.value);const karten=ids.map(id=>document.getElementById(id)?.closest("article")).filter(Boolean).filter(k=>!k.querySelector(".diagramm.ist-leer"));html=`<div class="v19123-diagramme">${karten.map(k=>`<section class="v19123-diagramm">${k.innerHTML}</section>`).join("")}</div>`;const bv=document.getElementById("behandlungVerlauf")?.closest("article");if(bv)html+=`<section class="v19123-diagramm" style="margin-top:6mm"><h3>Behandlungsverlauf</h3>${document.getElementById("behandlungVerlauf").innerHTML}</section>`;}
    else if(art==="tagebuch"||art==="buch"){const radio=document.querySelector(`input[name="ausgabeModus"][value="${art}"]`);if(radio){radio.checked=true;document.getElementById("berichtVon").value=document.getElementById("v19123DruckVon").value;document.getElementById("berichtBis").value=document.getElementById("v19123DruckBis").value;renderBericht();}const aus=document.getElementById("berichtAusgabe");html=aus?.innerHTML?.trim()?aus.innerHTML:`<div class="v19123-leer">Für den gewählten Zeitraum sind keine Inhalte vorhanden.</div>`;}
    out.classList.toggle("v19123-sparsam",document.getElementById("v19123Dichte").value==="sparsam");out.innerHTML=kopf(titel)+html+'<div class="v19123-druckfuss">Seite</div>';
  };
  const arztSelect=document.getElementById("v19123DruckArzt");const arzte=[...new Set([...daten.eintraege.map(e=>e.arzt),...daten.fragen.map(e=>e.arzt)].filter(Boolean))].sort((a,b)=>a.localeCompare(b,"de"));arztSelect.innerHTML='<option value="">Alle Ärzte / Stellen</option>'+arzte.map(a=>`<option>${esc(a)}</option>`).join("");
  document.getElementById("v19123Druckarten").addEventListener("change",()=>{const a=artWert();document.getElementById("v19123DiagrammBox").hidden=a!=="diagramme";document.getElementById("v19123EinzelLabel").hidden=a!=="kosten";vorschau();});
  document.getElementById("v19123Vorschau").addEventListener("click",vorschau);
  const drucken=()=>{vorschau();document.body.classList.add("v19123-druckt");window.print();setTimeout(()=>document.body.classList.remove("v19123-druckt"),500);};
  document.getElementById("v19123Drucken").addEventListener("click",drucken);document.getElementById("v19123Pdf").addEventListener("click",drucken);window.addEventListener("afterprint",()=>document.body.classList.remove("v19123-druckt"));
  document.getElementById("v19123EinzelLabel").hidden=true;vorschau();
})();
