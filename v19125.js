"use strict";
(() => {
  const VERSION = "1.9.1.2.5";
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => [...r.querySelectorAll(s)];
  const safe = v => typeof esc === "function" ? esc(String(v ?? "")) : String(v ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const formatDatum = v => v && typeof datumLang === "function" ? datumLang(v) : (v || "–");
  const formatEuro = v => typeof euro === "function" ? euro(v) : `${Number(v || 0).toFixed(2).replace(".", ",")} €`;
  const heute = () => typeof heuteIso === "function" ? heuteIso() : new Date().toISOString().slice(0, 10);

  // Alle sichtbaren Laufzeitangaben angleichen, ohne gespeicherte Daten anzutasten.
  document.title = `Mein Begleiter ${VERSION} PWA – Persönliche Arbeitsversion`;

  // Der doppelte Berichtzugang auf der Startseite entfällt.
  const cockpit = q("#seite-cockpit");
  qa('button,[role="button"]', cockpit || document).forEach(b => {
    if (cockpit?.contains(b) && b.textContent.trim().replace(/^🖨\s*/, "") === "Bericht") b.remove();
  });

  // Gemeinsame Schriftgrößensteuerung für Einstellungen und Hilfe.
  const schriftKey = "mein-begleiter-schriftgroesse";
  const schriftAnwenden = wert => {
    const erlaubt = ["standard", "gross", "sehr-gross"].includes(wert) ? wert : "gross";
    document.documentElement.dataset.schrift = erlaubt;
    localStorage.setItem(schriftKey, erlaubt);
    qa("[data-v19125-schrift]").forEach(b => {
      const aktiv = b.dataset.v19125Schrift === erlaubt;
      b.classList.toggle("aktiv", aktiv);
      b.setAttribute("aria-pressed", String(aktiv));
    });
    qa("[data-schrift]").forEach(b => {
      const aktiv = b.dataset.schrift === erlaubt;
      b.classList.toggle("aktiv", aktiv);
      b.setAttribute("aria-pressed", String(aktiv));
    });
  };

  const hilfe = q("#seite-hilfe");
  if (hilfe) {
    const kopf = q(".v19121-seitenkopf", hilfe) || q(".kopf", hilfe);
    q("[data-einfuehrung]", hilfe)?.remove();
    const start = document.createElement("section");
    start.className = "v19125-einfuehrung";
    start.innerHTML = `<div class="v19125-einfuehrung-symbol" aria-hidden="true">🧭</div><div><h3>Neu bei „Mein Begleiter“?</h3><p>Eine kurze Einführung erklärt Ihnen die wichtigsten Bereiche und ersten Schritte.</p></div><button class="knopf" type="button" data-v19125-einfuehrung>▶ Einführung starten</button>`;
    const lesbar = document.createElement("section");
    lesbar.className = "v19125-lesbarkeit";
    lesbar.innerHTML = `<h3>Darstellung und Lesbarkeit</h3><h4>Schriftgröße</h4><p>Wählen Sie die für Sie angenehmste Darstellung. <strong>„Groß“ wird empfohlen.</strong></p><div class="v19125-schriftgruppe" role="group" aria-label="Schriftgröße wählen"><button type="button" data-v19125-schrift="standard">Standard</button><button type="button" data-v19125-schrift="gross">Groß – empfohlen</button><button type="button" data-v19125-schrift="sehr-gross">Sehr groß</button></div>`;
    kopf?.after(start, lesbar);
    q("[data-v19125-einfuehrung]", start).addEventListener("click", () => {
      const alt = q("[data-v186-hilfe]") || q("[data-einfuehrung]");
      if (alt) alt.click();
      else if (typeof zeigeEinfuehrung === "function") zeigeEinfuehrung();
      else q("#v186AnsichtDialog")?.showModal();
    });
    lesbar.addEventListener("click", e => {
      const b = e.target.closest("[data-v19125-schrift]");
      if (b) schriftAnwenden(b.dataset.v19125Schrift);
    });
  }
  schriftAnwenden(localStorage.getItem(schriftKey) || "gross");

  // Schnelle Mehrfacherfassung von Vitalwerten als eigener, kleiner Dialog.
  const vitalDialog = document.createElement("dialog");
  vitalDialog.id = "v19125VitalDialog";
  vitalDialog.className = "dialog v19125-vitaldialog";
  vitalDialog.innerHTML = `<form method="dialog"><div class="dialog-kopf"><div><h2>Vitalwerte eintragen</h2><p>Mehrere Messungen am selben Tag werden einzeln gespeichert.</p></div><button type="button" class="dialog-x" aria-label="Dialog schließen" data-vital-abbruch>×</button></div><div class="dialog-inhalt v19125-vitalraster"><label>Datum<input id="vitalDatum" type="date" required></label><label>Uhrzeit<input id="vitalZeit" type="time" required></label><label>Blutdruck SYS<input id="vitalSys" type="number" min="50" max="300" inputmode="numeric"></label><label>Blutdruck DIA<input id="vitalDia" type="number" min="30" max="200" inputmode="numeric"></label><label>Puls /min<input id="vitalPuls" type="number" min="20" max="250" inputmode="numeric"></label><label>Temperatur °C<input id="vitalTemp" type="number" min="30" max="45" step="0.1" inputmode="decimal"></label><label>Messstelle<select id="vitalTempOrt"><option value="">Nicht angegeben</option><option>Ohr</option><option>Mund</option><option>Stirn</option><option>Achsel</option><option>Rektal</option><option>Andere Messstelle</option></select></label><label>Sauerstoffsättigung %<input id="vitalSpo2" type="number" min="50" max="100" inputmode="numeric"></label><label>Blutzucker<input id="vitalZucker" type="number" min="0" step="0.1" inputmode="decimal"></label><label>Einheit<select id="vitalZuckerEinheit"><option value="mg/dl">mg/dl</option><option value="mmol/l">mmol/l</option></select></label><label class="span2">Situation oder kurze Notiz<textarea id="vitalNotiz" rows="2"></textarea></label></div><div class="dialog-fuss"><button type="button" class="knopf sekundaer" data-vital-abbruch>Abbrechen</button><button type="button" class="knopf" id="vitalSpeichern">Vitalwerte speichern</button></div></form>`;
  document.body.appendChild(vitalDialog);
  const vitalOeffnen = () => {
    q("#vitalDatum").value = heute();
    q("#vitalZeit").value = new Date().toTimeString().slice(0, 5);
    qa("#v19125VitalDialog input:not(#vitalDatum):not(#vitalZeit),#v19125VitalDialog textarea").forEach(x => x.value = "");
    vitalDialog.showModal();
  };
  qa("[data-vital-abbruch]", vitalDialog).forEach(b => b.addEventListener("click", () => vitalDialog.close()));
  q("#vitalSpeichern").addEventListener("click", () => {
    const datum = q("#vitalDatum").value, zeit = q("#vitalZeit").value;
    if (!datum || !zeit) { if (typeof toast === "function") toast("Bitte Datum und Uhrzeit eintragen."); return; }
    const zahl = id => q(id).value === "" ? "" : Number(q(id).value);
    const e = {id:"v" + Date.now(), datum, messUhrzeit:zeit, arzt:"", terminstatus:"Geplant", massnahme:"Vitalwerte", bemerkung:"", gedanken:"", buchMoment:"normal", rechnung:0, rezept:0, fahrt:0, befinden:"", befindenWert:"", schmerz:"", energie:"", schlaf:"", gewicht:"", tageszeit:"", messsituation:"", messnotiz:q("#vitalNotiz").value.trim(), schmerzOrt:"", schlafQualitaet:"", temperatur:zahl("#vitalTemp"), temperaturOrt:q("#vitalTempOrt").value, beschwerden:"", blutdruckSys:zahl("#vitalSys"), blutdruckDia:zahl("#vitalDia"), puls:zahl("#vitalPuls"), spo2:zahl("#vitalSpo2"), atemfrequenz:"", blutzucker:zahl("#vitalZucker"), blutzuckerEinheit:q("#vitalZuckerEinheit").value, blutzuckerZeitpunkt:"", trinkmenge:"", urinmenge:"", stuhlgang:"", appetit:"", uebelkeit:"", atemnot:"", schwellungen:"", aktivitaetMin:"", schritte:""};
    const hatWert = [e.temperatur,e.blutdruckSys,e.blutdruckDia,e.puls,e.spo2,e.blutzucker].some(v => v !== "") || e.messnotiz;
    if (!hatWert) { if (typeof toast === "function") toast("Bitte mindestens einen Messwert eintragen."); return; }
    daten.eintraege.push(e);
    if (typeof speichern === "function") speichern();
    if (typeof renderAlles === "function") renderAlles();
    vitalDialog.close();
    if (typeof toast === "function") toast("Vitalwerte gespeichert");
  });
  const vitalButton = document.createElement("button");
  vitalButton.type = "button"; vitalButton.className = "knopf v19125-vitalbutton"; vitalButton.innerHTML = "＋ Vitalwerte eintragen";
  vitalButton.addEventListener("click", vitalOeffnen);
  const cockpitAktionen = q("#seite-cockpit .kopf-aktionen") || q("#seite-cockpit .cockpit-aktionen") || q("#seite-cockpit .schnellaktionen");
  cockpitAktionen?.appendChild(vitalButton);

  // Eigene Dokumentkategorien auch im Filter verwenden.
  async function dokumentKategorienAktualisieren() {
    try {
      const ds = typeof alleDokumente === "function" ? await alleDokumente() : [];
      const selects = [q("#dokumentKategorie"), q("#dokumentAendernKategorie")].filter(Boolean);
      const filter = q("#dokumentFilter");
      const standard = [...selects.flatMap(s => [...s.options].map(o => o.value)), ...ds.map(d => d.kategorie)].filter(Boolean);
      const werte = [...new Set(standard)].filter(x => x !== "Alle" && x !== "Sonstiges").sort((a,b) => a.localeCompare(b,"de")).concat("Sonstiges");
      selects.forEach(s => {
        const vorher = s.value;
        s.innerHTML = werte.map(w => `<option value="${safe(w)}">${safe(w)}</option>`).join("");
        if (werte.includes(vorher)) s.value = vorher;
      });
      if (filter) {
        const vorher = filter.value;
        filter.innerHTML = `<option value="Alle">Alle Kategorien</option>${werte.map(w => `<option value="${safe(w)}">${safe(w)}</option>`).join("")}`;
        filter.value = [...filter.options].some(o => o.value === vorher) ? vorher : "Alle";
      }
    } catch (_) {}
  }
  dokumentKategorienAktualisieren();
  document.addEventListener("click", e => {
    if (e.target.closest("#dokumentSpeichern,#dokumentAendernSpeichern")) setTimeout(dokumentKategorienAktualisieren, 250);
  }, true);

  // Erfassungsdatum bei künftig neu angelegten Fragen ergänzen.
  document.addEventListener("click", e => {
    if (!e.target.closest("#frageHinzufuegen,#neuFrageSpeichern,#neuTerminSpeichern")) return;
    const vorher = new Set(daten.fragen.map(f => f.id));
    setTimeout(() => {
      let geaendert = false;
      daten.fragen.forEach(f => { if (!vorher.has(f.id) && !f.erfasstAm) { f.erfasstAm = heute(); geaendert = true; } });
      if (geaendert && typeof speichern === "function") speichern();
    }, 50);
  }, true);

  // Professionelle Titelseite nach jeder Bucherzeugung ergänzen.
  const titelblattVerbessern = root => {
    qa(".buch-titelblatt", root).forEach(t => {
      if (t.dataset.v19125 === "1") return;
      t.dataset.v19125 = "1";
      const h = q("h3", t);
      const unter = q(".untertitel", t);
      const ps = qa(":scope > p", t);
      const zeitraum = ps.find(p => /\d{1,2}\.\d{1,2}\.\d{4}/.test(p.textContent));
      t.innerHTML = `<img class="v19125-titellogo" src="icons/icon-192.png" alt="Mein Begleiter – Kompass und Leuchtturm"><div class="v19125-ausgabe">Persönliches Buch</div><div class="v19125-goldlinie"></div><h3>${safe(h?.textContent || "Höhen und Tiefen")}</h3><div class="untertitel">${safe(unter?.textContent || "Meine Erfahrungen und Fortschritte")}</div>${zeitraum ? `<p class="v19125-zeitraum">${safe(zeitraum.textContent)}</p>` : ""}<div class="v19125-wasserzeichen" aria-hidden="true">✥</div>`;
    });
  };
  const berichtAusgabe = q("#berichtAusgabe");
  if (berichtAusgabe) new MutationObserver(() => titelblattVerbessern(berichtAusgabe)).observe(berichtAusgabe, {childList:true,subtree:true});
  titelblattVerbessern(document);

  // Das bisherige Druckzentrum vollständig durch eine eindeutige Logik ersetzen.
  q("#seite-drucken")?.remove();
  const seite = document.createElement("section");
  seite.className = "seite"; seite.id = "seite-drucken";
  seite.innerHTML = `<button class="knopf sekundaer zur-uebersicht" type="button" data-zur>← Zur Übersicht</button><div class="v19121-seitenkopf"><div><h2>Druckzentrum</h2><p>Wählen Sie den Inhalt aus. Es werden nur die dazu passenden Einstellungen angezeigt.</p></div></div><article class="karte"><h3>Was möchten Sie drucken?</h3><div class="v19123-druckauswahl" id="v19125Druckarten"></div><div class="v19125-druckfilter"><label>Von<input class="filter" id="v19125Von" type="date"></label><label>Bis<input class="filter" id="v19125Bis" type="date"></label><label id="v19125ArztLabel">Arzt / Stelle<select class="filter" id="v19125Arzt"><option value="">Alle Ärzte / Stellen</option></select></label><label>Druckdichte<select class="filter" id="v19125Dichte"><option value="lesbar">Gut lesbar – empfohlen</option><option value="sparsam">Papiersparend</option></select></label></div><fieldset id="v19125KostenBox" class="v19125-zusatz" hidden><legend>Kostenübersicht drucken</legend><label><input type="radio" name="v19125-kosten" value="kurz"> Kurzübersicht</label><label><input type="radio" name="v19125-kosten" value="detail" checked> Detaillierte Übersicht mit Einzelposten</label></fieldset><fieldset id="v19125DiagrammBox" class="v19125-zusatz" hidden><legend>Diagramme auswählen</legend><div class="v19123-diagrammauswahl" id="v19125Diagramme"></div></fieldset><div class="v19125-format" id="v19125Format"></div><div class="v19123-druckaktionen"><button class="knopf" type="button" id="v19125Drucken">🖨 Drucken oder als PDF speichern</button></div><p class="hinweis">Im Druckfenster können Sie einen Drucker auswählen oder die Ausgabe als PDF speichern.</p></article><article class="v19123-vorschau" id="v19125Vorschau" aria-live="polite"></article>`;
  q("main").appendChild(seite);
  q("[data-zur]", seite).addEventListener("click", () => typeof wechsleSeite === "function" && wechsleSeite("cockpit"));
  const arten = [["fragen","Offene Fragen"],["kommend","Kommende Termine mit Fragen"],["vergangen","Vergangene Termine"],["alletermine","Alle Termine"],["medikamente","Medikamentenplan"],["behandlung","Behandlung & Medikamente"],["nebenwirkungen","Beobachtete Nebenwirkungen"],["schritte","Behandlungsschritte"],["dokumente","Liste meiner Dokumente"],["kosten","Kostenübersicht"],["verlauf","Verlauf"],["diagramme","Ausgewählte Diagramme"],["tagebuch","Tagebuch"],["buch","Persönliches Buch"]];
  q("#v19125Druckarten").innerHTML = arten.map((a,i) => `<label><input type="radio" name="v19125-art" value="${a[0]}" ${i===0?"checked":""}> ${a[1]}</label>`).join("");
  const diagramme = [["chartBefinden","Befinden"],["chartSchmerz","Schmerz"],["chartEnergie","Energie"],["chartSchlaf","Schlaf"],["chartGewicht","Gewicht"],["chartTemperatur","Körpertemperatur"],["chartBlutdruck","Blutdruck"],["chartPuls","Puls"],["chartSpo2","Sauerstoffsättigung"],["chartBlutzucker","Blutzucker"],["chartAtemfrequenz","Atemfrequenz"]];
  q("#v19125Diagramme").innerHTML = diagramme.map((d,i) => `<label><input type="checkbox" value="${d[0]}" ${i<4?"checked":""}> ${d[1]}</label>`).join("");
  const arztWerte = [...new Set([...daten.eintraege.map(e=>e.arzt),...daten.fragen.map(f=>f.arzt)].filter(Boolean))].sort((a,b)=>a.localeCompare(b,"de"));
  q("#v19125Arzt").innerHTML = `<option value="">Alle Ärzte / Stellen</option>${arztWerte.map(a=>`<option value="${safe(a)}">${safe(a)}</option>`).join("")}`;
  let druckDokumente = [];
  const dokumenteLaden = async () => { try { druckDokumente = typeof alleDokumente === "function" ? await alleDokumente() : []; } catch (_) { druckDokumente = []; } };
  dokumenteLaden();
  const art = () => q('[name="v19125-art"]:checked')?.value || "fragen";
  const imZeitraum = e => { const v=q("#v19125Von").value||"0000-01-01", b=q("#v19125Bis").value||"9999-12-31"; return e.datum && e.datum>=v && e.datum<=b; };
  const beimArzt = e => { const a=q("#v19125Arzt").value; return !a || String(e.arzt||e.stelle||e.quelleName||"")===a; };
  const tabelle = (spalten, zeilen) => zeilen.length ? `<table class="v19123-druckliste"><thead><tr>${spalten.map(s=>`<th>${s}</th>`).join("")}</tr></thead><tbody>${zeilen.join("")}</tbody></table>` : `<div class="v19123-leer">Keine passenden Daten vorhanden.</div>`;
  const kopf = titel => { const von=q("#v19125Von").value,bis=q("#v19125Bis").value; return `<header class="v19125-druckkopf"><h2>${safe(titel)}</h2><div>Erstellt: ${formatDatum(heute())}${von||bis ? ` · Zeitraum: ${safe(typeof zeitraumText==="function"?zeitraumText(von,bis):`${von||"Beginn"} bis ${bis||"heute"}`)}`:""}</div></header>`; };
  const terminFragen = termine => {
    const normal = w => String(w||"").trim().toLocaleLowerCase("de-DE").replace(/\s+/g," ");
    const verwendet = new Set();
    let html = termine.map(t => {
      const fs = daten.fragen.filter(f => !f.erledigt && (f.terminId===t.id || (!f.terminId && f.arzt && normal(f.arzt)===normal(t.arzt))));
      fs.forEach(f=>verwendet.add(f.id));
      return `<section class="v19125-terminblock"><h3>${formatDatum(t.datum)}${t.messUhrzeit?` · ${safe(t.messUhrzeit)} Uhr`:""} – ${safe(t.arzt||t.stelle||"Termin")}</h3><p>${safe(t.massnahme||t.bemerkung||"")}</p><p class="v19125-status">Status: ${safe(typeof terminStatus==="function"?terminStatus(t):(t.terminstatus||"Geplant"))}</p><h4>Meine Fragen für diesen Termin</h4>${fs.length?`<ul>${fs.map(f=>`<li>${safe(f.text)}</li>`).join("")}</ul>`:`<p class="v19125-keine">Keine offenen Fragen für diesen Termin.</p>`}</section>`;
    }).join("");
    const ohne = daten.fragen.filter(f=>!f.erledigt&&!verwendet.has(f.id));
    if (ohne.length) html += `<section class="v19125-nichtzugeordnet"><h3>Noch keinem Termin zugeordnete Fragen</h3><ul>${ohne.map(f=>`<li><strong>${safe(f.arzt||"Allgemein")}:</strong> ${safe(f.text)}</li>`).join("")}</ul></section>`;
    return html || `<div class="v19123-leer">Keine kommenden Termine vorhanden.</div>`;
  };
  const kostenHtml = () => {
    const x=daten.eintraege.filter(imZeitraum), sum=f=>x.reduce((a,e)=>a+(Number(e[f])||0),0), r=sum("rechnung"),z=sum("rezept"),f=sum("fahrt"), detail=q('[name="v19125-kosten"]:checked')?.value!=="kurz";
    let html=`<div class="v19123-kosten"><div>Rechnungen<strong>${formatEuro(r)}</strong></div><div>Rezepte<strong>${formatEuro(z)}</strong></div><div>Fahrtkosten<strong>${formatEuro(f)}</strong></div><div>Gesamt<strong>${formatEuro(r+z+f)}</strong></div></div><h3>Verteilung nach Kostenart</h3><p>Rechnungen ${formatEuro(r)} · Rezepte ${formatEuro(z)} · Fahrtkosten ${formatEuro(f)}</p>`;
    if(detail){const zeilen=x.flatMap(e=>[["rechnung","Rechnung"],["rezept","Rezept"],["fahrt","Fahrtkosten"]].filter(([k])=>Number(e[k])).map(([k,n])=>`<tr><td>${formatDatum(e.datum)}</td><td>${n}</td><td>${safe(e.arzt||e.massnahme||e.bemerkung||"–")}</td><td>${formatEuro(e[k])}</td></tr>`)); html+=`<h3>Einzelposten</h3>${tabelle(["Datum","Kostenart","Bezeichnung / Empfänger","Betrag"],zeilen)}<p class="v19125-gesamtsumme"><strong>Gesamtsumme: ${formatEuro(r+z+f)}</strong></p>`;}
    return html;
  };
  const vorschau = async () => {
    const a=art(), out=q("#v19125Vorschau"), quer=["verlauf","diagramme"].includes(a), titel=arten.find(x=>x[0]===a)?.[1]||"Ausdruck";
    q("#v19125KostenBox").hidden=a!=="kosten"; q("#v19125DiagrammBox").hidden=a!=="diagramme";
    q("#v19125ArztLabel").hidden=["kosten","verlauf","diagramme","medikamente"].includes(a);
    q("#v19125Format").textContent=`Druckformat: DIN A4 ${quer?"quer":"hoch"} – automatisch gewählt.`;
    let html="";
    if(a==="fragen"){
      const offene=daten.fragen.filter(f=>!f.erledigt).filter(beimArzt).sort((x,y)=>{const tx=daten.eintraege.find(e=>e.id===x.terminId),ty=daten.eintraege.find(e=>e.id===y.terminId);return String(tx?.datum||"9999").localeCompare(String(ty?.datum||"9999"));});
      html=tabelle(["Termin am","Arzt / Stelle","Offene Frage"],offene.map(f=>{const t=daten.eintraege.find(e=>e.id===f.terminId);return `<tr><td>${t?formatDatum(t.datum):"Noch nicht zugeordnet"}${f.erfasstAm?`<small>Frage erfasst am ${formatDatum(f.erfasstAm)}</small>`:`<small>Erfassungsdatum nicht vorhanden</small>`}</td><td>${safe(f.arzt||t?.arzt||"Allgemein")}</td><td>${safe(f.text)}</td></tr>`;}));
    } else if(a==="kommend") {
      const ts=alleTermine().filter(imZeitraum).filter(beimArzt).filter(istKommenderTermin).sort((x,y)=>zeitSchluessel(x).localeCompare(zeitSchluessel(y))); html=terminFragen(ts);
    } else if(["vergangen","alletermine"].includes(a)) {
      let ts=alleTermine().filter(imZeitraum).filter(beimArzt); if(a==="vergangen")ts=ts.filter(e=>!istKommenderTermin(e)); ts.sort((x,y)=>zeitSchluessel(x).localeCompare(zeitSchluessel(y))); html=tabelle(["Datum","Arzt / Stelle","Termin","Status"],ts.map(e=>`<tr><td>${formatDatum(e.datum)}${e.messUhrzeit?`<br>${safe(e.messUhrzeit)} Uhr`:""}</td><td>${safe(e.arzt||"")}</td><td>${safe(e.massnahme||e.bemerkung||"")}</td><td>${safe(terminStatus(e))}</td></tr>`));
    } else if(a==="kosten") html=kostenHtml();
    else if(a==="medikamente") html=tabelle(["Medikament","Anwendung","Abstand"],daten.medikamente.map(m=>`<tr><td>${safe(m.name)}</td><td>${safe(m.anwendung||m.zeit||"")}</td><td>${m.weitereGeplant===false?"Behandlung beendet":safe(m.abstand?`${m.abstand} ${m.einheit||"Tage"}`:"")}</td></tr>`));
    else if(a==="nebenwirkungen") html=tabelle(["Datum","Medikament","Beobachtung"],daten.nebenwirkungen.filter(imZeitraum).map(n=>`<tr><td>${formatDatum(n.datum)}</td><td>${safe(n.medName||"")}</td><td>${safe(n.beschwerde||"")}</td></tr>`));
    else if(a==="schritte") html=tabelle(["Datum","Behandlungsschritt","Ort / Stelle","Status"],daten.schritte.filter(imZeitraum).map(s=>`<tr><td>${formatDatum(s.datum)}</td><td>${safe(s.titel||s.name||s.massnahme||"")}</td><td>${safe(s.ort||s.stelle||s.arzt||"")}</td><td>${safe(s.status||"")}</td></tr>`));
    else if(a==="behandlung") html=`<h3>Medikamentenplan</h3>${tabelle(["Medikament","Anwendung"],daten.medikamente.map(m=>`<tr><td>${safe(m.name)}</td><td>${safe(m.anwendung||m.zeit||"")}</td></tr>`))}<h3>Behandlungsschritte</h3>${tabelle(["Datum","Behandlungsschritt","Status"],daten.schritte.filter(imZeitraum).map(s=>`<tr><td>${formatDatum(s.datum)}</td><td>${safe(s.titel||s.name||s.massnahme||"")}</td><td>${safe(s.status||"")}</td></tr>`))}`;
    else if(a==="dokumente") {await dokumenteLaden(); const v=q("#v19125Von").value||"0000-01-01",b=q("#v19125Bis").value||"9999-12-31"; const ds=druckDokumente.filter(d=>{const dt=d.dokumentDatum||d.datum||(d.erstellt||"").slice(0,10);return dt>=v&&dt<=b&&beimArzt(d);}); html=`<p class="v19124-erklaerung">Übersicht der gespeicherten Dokumente. Die Dokumentinhalte selbst werden nicht gedruckt.</p>${tabelle(["Datum","Dokument","Kategorie","Arzt / Stelle","Seiten"],ds.map(d=>`<tr><td>${formatDatum(d.dokumentDatum||d.datum||(d.erstellt||"").slice(0,10))}</td><td>${safe(d.name||"Dokument")}</td><td>${safe(d.kategorie||"Sonstiges")}</td><td>${safe(d.quelleName||"")}</td><td>${d.seiten?.length||1}</td></tr>`))}`;}
    else if(["verlauf","diagramme"].includes(a)) {const vf=q("#verlaufVon"),vb=q("#verlaufBis");if(vf)vf.value=q("#v19125Von").value;if(vb)vb.value=q("#v19125Bis").value;if(typeof renderVerlauf==="function")renderVerlauf();const ids=a==="verlauf"?diagramme.map(d=>d[0]):qa("#v19125Diagramme input:checked").map(i=>i.value);const cards=ids.map(id=>q(`#${id}`)?.closest("article")).filter(Boolean).filter(c=>!q(".diagramm.ist-leer",c));html=cards.length?`<div class="v19125-diagramme">${cards.map(c=>`<section class="v19125-diagramm">${c.innerHTML}</section>`).join("")}</div>`:`<div class="v19123-leer">Für die Auswahl sind noch keine bewerteten Werte vorhanden.</div>`;if(a==="verlauf"&&q("#behandlungVerlauf"))html+=`<section class="v19125-behandlung"><h3>Behandlungsverlauf</h3>${q("#behandlungVerlauf").innerHTML}</section>`;}
    else if(["tagebuch","buch"].includes(a)) {const radio=q(`input[name="ausgabeModus"][value="${a}"]`);if(radio){radio.checked=true;if(q("#berichtVon"))q("#berichtVon").value=q("#v19125Von").value;if(q("#berichtBis"))q("#berichtBis").value=q("#v19125Bis").value;if(typeof renderBericht==="function")renderBericht();}titelblattVerbessern(q("#berichtAusgabe")||document);html=q("#berichtAusgabe")?.innerHTML||`<div class="v19123-leer">Keine Inhalte vorhanden.</div>`;}
    out.className=`v19123-vorschau${q("#v19125Dichte").value==="sparsam"?" v19123-sparsam":""}${quer?" v19125-quer":" v19125-hoch"}`; out.innerHTML=kopf(titel)+html;
  };
  let timer=0; const planen=()=>{clearTimeout(timer);timer=setTimeout(vorschau,80);};
  seite.addEventListener("change", planen); qa("#v19125Von,#v19125Bis",seite).forEach(x=>x.addEventListener("input",planen));
  q("#v19125Drucken").addEventListener("click", async()=>{await vorschau();document.body.classList.toggle("v19125-print-quer",["verlauf","diagramme"].includes(art()));document.body.classList.add("v19125-druckt");await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));window.print();});
  window.addEventListener("afterprint",()=>document.body.classList.remove("v19125-druckt","v19125-print-quer"));
  vorschau();
})();
