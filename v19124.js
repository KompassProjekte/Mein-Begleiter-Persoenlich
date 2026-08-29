"use strict";
(() => {
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
  // Ab 1.9.1.2.4 bleibt die Navigation vollständig. Der missverständliche
  // Ansichtswechsel wird entfernt, ohne Daten oder Einstellungen zu löschen.
  document.documentElement.classList.remove("v19123-einfach", "v186-einfach");
  document.querySelectorAll(".v19123-nur-voll,.v19122-nur-voll,.v186-nur-voll").forEach(e => e.classList.remove("v19123-nur-voll", "v19122-nur-voll", "v186-nur-voll"));
  const alterAnsichtDialog = document.getElementById("v186AnsichtDialog");
  if (alterAnsichtDialog?.open) alterAnsichtDialog.close();
  alterAnsichtDialog?.remove();
  document.querySelectorAll("[data-v186-modus],[data-v186-start]").forEach(e => e.remove());
  const umbenennen = (root) => root?.querySelectorAll('[data-seite="behandlung"]').forEach(b => {
    const symbol = b.querySelector(".symbol")?.outerHTML || "💊 ";
    b.innerHTML = `${symbol}Behandlung &amp; Medikamente`;
  });
  umbenennen(document);

  const einstellungen = document.getElementById("seite-einstellungen");
  if (einstellungen) {
    einstellungen.querySelector(".v19121-ansicht")?.remove();
    einstellungen.querySelector(".v19123-ansicht-status")?.remove();
    const darstellungTitel = [...einstellungen.querySelectorAll("h3")].find(h => h.textContent.trim() === "Darstellung");
    darstellungTitel?.nextElementSibling?.remove();
    darstellungTitel?.remove();
    einstellungen.querySelector(".v19121-seitenkopf p")?.replaceChildren(document.createTextNode("Freiwillige Tages-Check-Werte und gut lesbare Schrift festlegen."));
    const box = document.createElement("section");
    box.className = "v19124-schriftwahl";
    box.innerHTML = `<h3>Schriftgröße</h3><p>Wählen Sie die für Sie angenehmste Darstellung. „Groß“ wird empfohlen.</p><div role="group" aria-label="Schriftgröße wählen"><button type="button" data-schrift="standard">Standard</button><button type="button" data-schrift="gross">Groß – empfohlen</button><button type="button" data-schrift="sehr-gross">Sehr groß</button></div>`;
    const ziel = einstellungen.querySelector("[data-tagescheck-einstellungen]");
    ziel?.before(box);
    const schriftKey = "mein-begleiter-schriftgroesse";
    const schriftAnwenden = wert => {
      const erlaubt = ["standard", "gross", "sehr-gross"].includes(wert) ? wert : "gross";
      document.documentElement.dataset.schrift = erlaubt;
      localStorage.setItem(schriftKey, erlaubt);
      box.querySelectorAll("[data-schrift]").forEach(b => { const aktiv = b.dataset.schrift === erlaubt; b.classList.toggle("aktiv", aktiv); b.setAttribute("aria-pressed", String(aktiv)); });
    };
    box.addEventListener("click", e => { const b = e.target.closest("[data-schrift]"); if (b) schriftAnwenden(b.dataset.schrift); });
    schriftAnwenden(localStorage.getItem(schriftKey) || "gross");
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
  druck.innerHTML = `<button class="knopf sekundaer zur-uebersicht" type="button" data-zur>← Zur Übersicht</button><div class="v19121-seitenkopf"><div><h2>Druckzentrum</h2><p>Wählen Sie genau den Inhalt aus, den Sie drucken oder als PDF speichern möchten.</p></div></div><article class="karte"><h3>Was möchten Sie drucken?</h3><div class="v19123-druckauswahl" id="v19123Druckarten"></div><div class="v19123-druckfilter"><label>Von<input class="filter" id="v19123DruckVon" type="date"></label><label>Bis<input class="filter" id="v19123DruckBis" type="date"></label><label>Arzt / Stelle<select class="filter" id="v19123DruckArzt"><option value="">Alle Ärzte / Stellen</option></select></label><label>Druckdichte<select class="filter" id="v19123Dichte"><option value="lesbar">Gut lesbar – empfohlen</option><option value="sparsam">Papiersparend</option></select></label></div><div id="v19124KostenBox" hidden><h4>Umfang der Kostenübersicht</h4><select class="filter" id="v19124KostenModus"><option value="kompakt">Kompakte Gesamtübersicht – empfohlen</option><option value="detailliert">Detaillierter Kostennachweis</option><option value="eigen">Eigene Auswahl</option></select><div id="v19124KostenEigen" hidden><label><input type="checkbox" value="rechnung" checked> Rechnungen</label><label><input type="checkbox" value="rezept" checked> Rezepte</label><label><input type="checkbox" value="fahrt" checked> Fahrtkosten</label><label><input type="checkbox" value="verteilung" checked> Verteilung</label><label><input type="checkbox" value="einzel"> Einzelposten</label></div></div><div id="v19123DiagrammBox" hidden><h4>Diagramme auswählen</h4><div class="v19123-diagrammauswahl" id="v19123Diagramme"></div></div><div class="v19123-druckaktionen"><button class="knopf" type="button" id="v19123Vorschau">Vorschau aktualisieren</button><button class="knopf sekundaer" type="button" id="v19123Drucken">🖨 Drucken oder als PDF speichern</button></div><p class="hinweis">Im Druckfenster können Sie einen Drucker wählen oder die Ausgabe als PDF speichern.</p></article><article class="v19123-vorschau" id="v19123DruckVorschau" aria-live="polite"></article>`;
  document.querySelector("main").appendChild(druck);
  druck.querySelector("[data-zur]").addEventListener("click", () => wechsleSeite("cockpit"));
  const arten = [["fragen","Offene Fragen"],["kommend","Kommende Termine"],["vergangen","Vergangene Termine"],["alletermine","Alle Termine"],["medikamente","Medikamentenplan"],["behandlung","Behandlung & Medikamente"],["nebenwirkungen","Beobachtete Nebenwirkungen"],["schritte","Behandlungsschritte"],["dokumente","Liste meiner Dokumente"],["kosten","Kostenübersicht"],["verlauf","Verlauf"],["diagramme","Ausgewählte Diagramme"],["tagebuch","Tagebuch"],["buch","Persönliches Buch"]];
  document.getElementById("v19123Druckarten").innerHTML = arten.map((a,i)=>`<label><input type="radio" name="v19123-art" value="${a[0]}" ${i===0?"checked":""}> ${a[1]}</label>`).join("");
  const diagramme = [["chartBefinden","Befinden"],["chartSchmerz","Schmerz"],["chartEnergie","Energie"],["chartSchlaf","Schlaf"],["chartGewicht","Gewicht"],["chartTemperatur","Körpertemperatur"],["chartBlutdruck","Blutdruck"],["chartPuls","Puls"],["chartSpo2","Sauerstoffsättigung"],["chartBlutzucker","Blutzucker"],["chartAtemfrequenz","Atemfrequenz"]];
  document.getElementById("v19123Diagramme").innerHTML = diagramme.map((d,i)=>`<label><input type="checkbox" value="${d[0]}" ${i<4?"checked":""}> ${d[1]}</label>`).join("");
  const artWert=()=>document.querySelector('[name="v19123-art"]:checked')?.value||"fragen";
  let druckDokumente=[];
  const dokumenteFuerDruckLaden=async()=>{try{druckDokumente=typeof alleDokumente==="function"?await alleDokumente():[...dokumenteGeschichte];}catch(_){druckDokumente=[...dokumenteGeschichte];}};
  dokumenteFuerDruckLaden();
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
    else if(art==="dokumente"){const von=document.getElementById("v19123DruckVon").value||"0000-01-01",bis=document.getElementById("v19123DruckBis").value||"9999-12-31";const x=[...druckDokumente].filter(d=>{const tag=d.dokumentDatum||d.datum||(d.erstellt||"").slice(0,10);return tag&&tag>=von&&tag<=bis;}).sort((a,b)=>String(b.dokumentDatum||b.datum||b.erstellt||"").localeCompare(String(a.dokumentDatum||a.datum||a.erstellt||"")));html='<p class="v19124-erklaerung">Übersicht der gespeicherten Dokumente. Die Dokumentinhalte selbst werden nicht gedruckt.</p>'+tabelle(["Datum","Dokument","Kategorie","Arzt / Stelle","Seiten"],x.map(d=>`<tr><td>${datumLang(d.dokumentDatum||d.datum||(d.erstellt||"").slice(0,10))}</td><td>${esc(d.name||"Dokument")}</td><td>${esc(d.kategorie||"Sonstiges")}</td><td>${esc(d.quelleName||"")}</td><td>${d.seiten?.length||1}</td></tr>`));}
    else if(art==="kosten"){const x=daten.eintraege.filter(zeitraumPasst),modus=document.getElementById("v19124KostenModus").value,eigen=new Set([...document.querySelectorAll("#v19124KostenEigen input:checked")].map(i=>i.value)),aktiv=k=>modus!=="eigen"||eigen.has(k),sum=f=>x.reduce((a,e)=>a+(Number(e[f])||0),0),r=aktiv("rechnung")?sum("rechnung"):0,z=aktiv("rezept")?sum("rezept"):0,f=aktiv("fahrt")?sum("fahrt"):0;html=`<div class="v19123-kosten">${aktiv("rechnung")?`<div>Rechnungen<strong>${euro(r)}</strong></div>`:""}${aktiv("rezept")?`<div>Rezepte<strong>${euro(z)}</strong></div>`:""}${aktiv("fahrt")?`<div>Fahrtkosten<strong>${euro(f)}</strong></div>`:""}<div>Gesamt<strong>${euro(r+z+f)}</strong></div></div>`;if(modus!=="eigen"||aktiv("verteilung"))html+=`<h3>Verteilung nach Kostenart</h3><p>${aktiv("rechnung")?`Rechnungen ${euro(r)} · `:""}${aktiv("rezept")?`Rezepte ${euro(z)} · `:""}${aktiv("fahrt")?`Fahrtkosten ${euro(f)}`:""}</p>`;if(modus==="detailliert"||(modus==="eigen"&&aktiv("einzel")))html+=tabelle(["Datum","Art","Betrag"],x.flatMap(e=>[["rechnung","Rechnung"],["rezept","Rezept"],["fahrt","Fahrtkosten"]].filter(a=>aktiv(a[0])&&Number(e[a[0]])).map(a=>`<tr><td>${datumLang(e.datum)}</td><td>${a[1]}</td><td>${euro(e[a[0]])}</td></tr>`)));}
    else if(art==="diagramme"||art==="verlauf"){const verlaufVon=document.getElementById("verlaufVon"),verlaufBis=document.getElementById("verlaufBis");if(verlaufVon)verlaufVon.value=document.getElementById("v19123DruckVon").value;if(verlaufBis)verlaufBis.value=document.getElementById("v19123DruckBis").value;renderVerlauf();const ids=art==="verlauf"?diagramme.map(x=>x[0]):[...document.querySelectorAll("#v19123Diagramme input:checked")].map(x=>x.value);const karten=ids.map(id=>document.getElementById(id)?.closest("article")).filter(Boolean).filter(k=>!k.querySelector(".diagramm.ist-leer"));html=karten.length?`<div class="v19123-diagramme">${karten.map(k=>`<section class="v19123-diagramm">${k.innerHTML}</section>`).join("")}</div>`:'<div class="v19123-leer">Für die Auswahl sind noch keine bewerteten Werte vorhanden.</div>';const bv=document.getElementById("behandlungVerlauf")?.closest("article");if(art==="verlauf"&&bv)html+=`<section class="v19123-diagramm v19124-behandlungsverlauf"><h3>Behandlungsverlauf</h3>${document.getElementById("behandlungVerlauf").innerHTML}</section>`;}
    else if(art==="tagebuch"||art==="buch"){const radio=document.querySelector(`input[name="ausgabeModus"][value="${art}"]`);if(radio){radio.checked=true;document.getElementById("berichtVon").value=document.getElementById("v19123DruckVon").value;document.getElementById("berichtBis").value=document.getElementById("v19123DruckBis").value;renderBericht();}const aus=document.getElementById("berichtAusgabe");html=aus?.innerHTML?.trim()?aus.innerHTML:`<div class="v19123-leer">Für den gewählten Zeitraum sind keine Inhalte vorhanden.</div>`;}
    out.classList.toggle("v19123-sparsam",document.getElementById("v19123Dichte").value==="sparsam");out.innerHTML=kopf(titel)+html+'<div class="v19123-druckfuss">Seite</div>';
  };
  const arztSelect=document.getElementById("v19123DruckArzt");const arzte=[...new Set([...daten.eintraege.map(e=>e.arzt),...daten.fragen.map(e=>e.arzt)].filter(Boolean))].sort((a,b)=>a.localeCompare(b,"de"));arztSelect.innerHTML='<option value="">Alle Ärzte / Stellen</option>'+arzte.map(a=>`<option>${esc(a)}</option>`).join("");
  document.getElementById("v19123Druckarten").addEventListener("change",async()=>{const a=artWert();document.getElementById("v19123DiagrammBox").hidden=a!=="diagramme";document.getElementById("v19124KostenBox").hidden=a!=="kosten";if(a==="dokumente")await dokumenteFuerDruckLaden();vorschau();});
  document.getElementById("v19123Vorschau").addEventListener("click",vorschau);
  const drucken=async()=>{vorschau();document.body.classList.add("v19123-druckt");await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));window.print();};
  document.getElementById("v19123Drucken").addEventListener("click",drucken);window.addEventListener("afterprint",()=>document.body.classList.remove("v19123-druckt"));
  document.getElementById("v19124KostenModus").addEventListener("change",e=>{document.getElementById("v19124KostenEigen").hidden=e.target.value!=="eigen";vorschau();});
  document.getElementById("v19124KostenEigen").addEventListener("change",vorschau);vorschau();

  // Dateiname als änderbaren Titel vorschlagen.
  const dateiFeld = document.getElementById("dokumentDatei");
  const titelFeld = document.getElementById("dokumentTitel");
  const titelVorschlag = name => String(name || "")
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  let titelAutomatisch = "";
  dateiFeld?.addEventListener("change", () => {
    const dateien = [...dateiFeld.files];
    if (!dateien.length || (titelFeld.value.trim() && titelFeld.value.trim() !== titelAutomatisch)) return;
    titelAutomatisch = dateien.length === 1 ? titelVorschlag(dateien[0].name) : `${titelVorschlag(dateien[0].name)} – ${dateien.length} Seiten`;
    titelFeld.value = titelAutomatisch;
  });

  // Hinzufügen und Ändern verwenden dieselbe alphabetisch sortierte Kategorienliste.
  const katNeu = document.getElementById("dokumentKategorie");
  const katEdit = document.getElementById("dokumentAendernKategorie");
  const kategorienSynchronisieren = async (aktuell = "") => {
    const standard = [...katNeu.options, ...katEdit.options].map(o => o.value).filter(Boolean);
    let gespeichert = [];
    try { gespeichert = typeof alleDokumente === "function" ? (await alleDokumente()).map(d => d.kategorie) : []; } catch (_) {}
    const werte = [...new Set([...standard, ...gespeichert, aktuell].filter(Boolean))]
      .filter(x => x !== "Sonstiges").sort(de).concat("Sonstiges");
    [katNeu, katEdit].forEach(select => {
      if (!select) return;
      const vorher = select === katEdit && aktuell ? aktuell : select.value;
      select.innerHTML = werte.map(w => `<option value="${esc(w)}">${esc(w)}</option>`).join("");
      select.value = werte.includes(vorher) ? vorher : werte[0];
    });
  };
  kategorienSynchronisieren();
  const altDokumentAendern = window.dokumentAendern;
  if (typeof altDokumentAendern === "function") window.dokumentAendern = async id => {
    const d = await dokumentHolen(id);
    await kategorienSynchronisieren(d?.kategorie || "");
    return altDokumentAendern(id);
  };
  window.dokumentUmbenennen = window.dokumentAendern;

  // Verständliche Augen-Schaltfläche für beide Kennwortfelder.
  const zeigen = document.getElementById("geraetePasswortZeigen");
  const pass1 = document.getElementById("geraetePasswort");
  const pass2 = document.getElementById("geraetePasswort2");
  if (zeigen && pass1) {
    const label = zeigen.closest("label");
    const auge = document.createElement("button");
    auge.type = "button"; auge.className = "v19124-kennwort-auge";
    auge.innerHTML = '<span aria-hidden="true">👁</span><span>Kennwort anzeigen</span>';
    auge.setAttribute("aria-pressed", "false");
    const umschalten = sichtbar => {
      pass1.type = sichtbar ? "text" : "password";
      if (pass2) pass2.type = sichtbar ? "text" : "password";
      auge.setAttribute("aria-pressed", String(sichtbar));
      auge.innerHTML = sichtbar ? '<span aria-hidden="true">◉̸</span><span>Kennwort verbergen</span>' : '<span aria-hidden="true">👁</span><span>Kennwort anzeigen</span>';
    };
    auge.addEventListener("click", () => umschalten(auge.getAttribute("aria-pressed") !== "true"));
    label?.replaceWith(auge);
    document.getElementById("geraeteDialog")?.addEventListener("close", () => umschalten(false));
  }

  // Veraltete Hilfetexte berichtigen.
  document.querySelectorAll("#seite-hilfe details").forEach(d => {
    if (d.querySelector("summary")?.textContent.trim() === "Einstellungen") {
      const inhalt = d.querySelector("div");
      if (inhalt) inhalt.textContent = "Hier wählen Sie freiwillige Tages-Check-Werte und eine gut lesbare Schriftgröße.";
    }
  });
})();
