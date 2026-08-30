"use strict";
(() => {
  const VERSION = "1.9.1.2.5.8";
  const q = (s, r = document) => r.querySelector(s);
  const qa = (s, r = document) => [...r.querySelectorAll(s)];
  const safe = v => typeof esc === "function" ? esc(String(v ?? "")) : String(v ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const formatDatum = v => v && typeof datumLang === "function" ? datumLang(v) : (v || "–");
  const formatEuro = v => typeof euro === "function" ? euro(v) : `${Number(v || 0).toFixed(2).replace(".", ",")} €`;
  const heute = () => typeof heuteIso === "function" ? heuteIso() : new Date().toISOString().slice(0, 10);

  // Alle sichtbaren Laufzeitangaben angleichen, ohne gespeicherte Daten anzutasten.
  document.title = `Mein Begleiter ${VERSION} PWA – Persönliche Arbeitsversion`;

  // Messwerte aus 1.9.1.2.5 wurden versehentlich mit der Maßnahme
  // „Vitalwerte“ gespeichert und dadurch als Termine erkannt. Nur diese
  // falsche Termin-Kennzeichnung wird entfernt; sämtliche Messwerte bleiben.
  const istVitalmessung = e => {
    const hatMesswert = ["temperatur","blutdruckSys","blutdruckDia","puls","spo2","blutzucker"]
      .some(k => e?.[k] !== "" && e?.[k] !== null && e?.[k] !== undefined);
    return !String(e?.arzt || "").trim() && String(e?.massnahme || "").trim().toLocaleLowerCase("de-DE") === "vitalwerte" && hatMesswert;
  };
  // In 1.9.1.2.5.6 konnte die interne Kennzeichnung beim Ändern verloren
  // gehen. Eine Wiederherstellung erfolgt nur bei eindeutig reinen
  // Messdatensätzen. So bleiben Termine und Tageschecks unangetastet.
  const istMessungOhneKennzeichnung = e => {
    const vorhanden = k => e?.[k] !== "" && e?.[k] !== null && e?.[k] !== undefined;
    const hatMesswert = ["temperatur","blutdruckSys","blutdruckDia","puls","spo2","blutzucker"]
      .some(vorhanden);
    const hatTagescheck = [
      "befinden", "befindenWert", "schmerz", "energie", "schlaf", "gewicht",
      "gedanken", "beschwerden", "aktivitaetMin", "schritte", "atemfrequenz",
      "trinkmenge", "urinmenge", "stuhlgang", "appetit", "uebelkeit",
      "atemnot", "schwellungen"
    ].some(vorhanden);
    const hatKosten = ["rechnung", "rezept", "fahrt"].some(k => Number(e?.[k] || 0) !== 0);
    return !String(e?.arzt || "").trim()
      && !String(e?.massnahme || "").trim()
      && !String(e?.eintragsart || "").trim()
      && hatMesswert
      && !hatTagescheck
      && !hatKosten;
  };
  let vitalAltbestandBereinigt = false;
  daten.eintraege.forEach(e => {
    if (!istVitalmessung(e) && !istMessungOhneKennzeichnung(e)) return;
    e.eintragsart = "vitalwerte";
    e.massnahme = "";
    vitalAltbestandBereinigt = true;
  });
  if (vitalAltbestandBereinigt) {
    speichern();
    renderAlles();
  }

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
  vitalDialog.innerHTML = `<form method="dialog"><div class="dialog-kopf"><div><h2>Vitalwerte eintragen</h2><p>Mehrere Messungen am selben Tag werden einzeln gespeichert.</p></div><button type="button" class="dialog-x" aria-label="Dialog schließen" data-vital-abbruch>×</button></div><div class="dialog-inhalt v19125-vitalraster"><label>Datum<input id="vitalDatum" type="date" required></label><label>Uhrzeit<input id="vitalZeit" type="time" required></label><label>Blutdruck SYS<input id="vitalSys" type="number" min="50" max="300" inputmode="numeric"></label><label>Blutdruck DIA<input id="vitalDia" type="number" min="30" max="200" inputmode="numeric"></label><label>Puls /min<input id="vitalPuls" type="number" min="20" max="250" inputmode="numeric"></label><label>Temperatur °C<input id="vitalTemp" type="number" min="30" max="45" step="0.1" inputmode="decimal"></label><label>Messstelle<select id="vitalTempOrt"><option value="">Nicht angegeben</option><option>Ohr</option><option>Mund</option><option>Stirn</option><option>Achsel</option><option>Rektal</option><option>Andere Messstelle</option></select></label><label>Sauerstoffsättigung %<input id="vitalSpo2" type="number" min="50" max="100" inputmode="numeric"></label><label>Blutzucker<input id="vitalZucker" type="number" min="0" step="0.1" inputmode="decimal"></label><label>Einheit<select id="vitalZuckerEinheit"><option value="mg/dl">mg/dl</option><option value="mmol/l">mmol/l</option></select></label><label class="span2">Situation oder kurze Notiz<textarea id="vitalNotiz" rows="2"></textarea></label><div id="vitalStatus" class="v19125-vitalstatus span2" role="alert" hidden></div></div><div class="dialog-fuss"><button type="button" class="knopf sekundaer" data-vital-abbruch>Abbrechen</button><button type="button" class="knopf" id="vitalSpeichern">Vitalwerte speichern</button></div></form>`;
  document.body.appendChild(vitalDialog);
  const vitalOeffnen = () => {
    q("#vitalDatum").value = heute();
    q("#vitalZeit").value = new Date().toTimeString().slice(0, 5);
    qa("#v19125VitalDialog input:not(#vitalDatum):not(#vitalZeit),#v19125VitalDialog textarea").forEach(x => x.value = "");
    q("#vitalStatus").hidden = true;
    vitalDialog.showModal();
  };
  qa("[data-vital-abbruch]", vitalDialog).forEach(b => b.addEventListener("click", () => vitalDialog.close()));
  q("#vitalSpeichern").addEventListener("click", () => {
    const datum = q("#vitalDatum").value, zeit = q("#vitalZeit").value;
    if (!datum || !zeit) { if (typeof toast === "function") toast("Bitte Datum und Uhrzeit eintragen."); return; }
    const zahl = id => q(id).value === "" ? "" : Number(q(id).value);
    const e = {temperatur:zahl("#vitalTemp"), temperaturOrt:q("#vitalTempOrt").value, blutdruckSys:zahl("#vitalSys"), blutdruckDia:zahl("#vitalDia"), puls:zahl("#vitalPuls"), spo2:zahl("#vitalSpo2"), blutzucker:zahl("#vitalZucker"), blutzuckerEinheit:q("#vitalZuckerEinheit").value, messnotiz:q("#vitalNotiz").value.trim()};
    const hatWert = [e.temperatur,e.blutdruckSys,e.blutdruckDia,e.puls,e.spo2,e.blutzucker].some(v => v !== "") || e.messnotiz;
    if (!hatWert) { if (typeof toast === "function") toast("Bitte mindestens einen Messwert eintragen."); return; }
    const speichernKnopf = q("#vitalSpeichern");
    speichernKnopf.disabled = true;
    try {
      // Direkt als eigener Messdatensatz speichern. Der frühere Umweg über das
      // geschlossene allgemeine Eintragsformular wurde nicht von jedem Browser
      // zuverlässig ausgeführt.
      const id = `j${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const neuerEintrag = typeof leeresEintragObjekt === "function"
        ? leeresEintragObjekt(id, datum, zeit)
        : { id, datum, messUhrzeit: zeit, arzt: "", massnahme: "", terminstatus: "Geplant" };
      Object.assign(neuerEintrag, e, {
        eintragsart: "vitalwerte",
        arzt: "",
        massnahme: "",
        datum,
        messUhrzeit: zeit,
      });
      daten.eintraege.push(neuerEintrag);
      speichern();
      // Der erfolgreiche Speichervorgang darf nicht von einer nachfolgenden
      // Bildschirmaktualisierung verdeckt werden. Deshalb zuerst schließen
      // und bestätigen; die Ansichten werden anschließend getrennt erneuert.
      vitalDialog.close();
      if (typeof toast === "function") toast("Vitalwerte gespeichert");
      setTimeout(() => {
        ["renderTabelle", "renderCockpit", "renderVerlauf"].forEach(name => {
          try { if (typeof globalThis[name] === "function") globalThis[name](); } catch (fehler) { console.error(`${name} nach Vitalwertspeicherung:`, fehler); }
        });
      }, 0);
    } catch (fehler) {
      console.error("Vitalwerte konnten nicht gespeichert werden:", fehler);
      const status = q("#vitalStatus");
      status.textContent = "Die Vitalwerte konnten nicht gespeichert werden. Bitte brechen Sie ab und versuchen Sie es erneut.";
      status.hidden = false;
    } finally {
      speichernKnopf.disabled = false;
    }
  });
  const vitalButton = q("#v19128VitalButton") || document.createElement("button");
  vitalButton.type = "button"; vitalButton.id = "v19128VitalButton"; vitalButton.className = "knopf v19125-vitalbutton"; vitalButton.innerHTML = "＋ Vitalwerte eintragen";
  vitalButton.addEventListener("click", vitalOeffnen);
  const cockpitAktionen = q("#seite-cockpit .kopf-aktionen") || q("#seite-cockpit .cockpit-aktionen") || q("#seite-cockpit .schnellaktionen");
  if (!vitalButton.isConnected) cockpitAktionen?.appendChild(vitalButton);

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
      const von=q("#v19125Von")?.value||q("#berichtVon")?.value||"", bis=q("#v19125Bis")?.value||q("#berichtBis")?.value||"";
      let zeitraum="";
      if(/^\d{4}-\d{2}-\d{2}$/.test(von)&&/^\d{4}-\d{2}-\d{2}$/.test(bis)) zeitraum=`${formatDatum(von)} bis ${formatDatum(bis)}`;
      else if(typeof berichtEintraege==="function") { const ds=berichtEintraege().map(e=>e.datum).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)).sort(); if(ds.length) zeitraum=`${formatDatum(ds[0])} bis ${formatDatum(ds.at(-1))}`; }
      t.innerHTML = `<img class="v19125-titellogo" src="icons/logo-persoenlich.svg" alt="Mein Begleiter – Persönliche Arbeitsversion"><div class="v19125-ausgabe">Persönliches Buch</div><div class="v19125-goldlinie"></div><h3>${safe(h?.textContent || "Höhen und Tiefen")}</h3><div class="untertitel">${safe(unter?.textContent || "Meine Erfahrungen und Fortschritte")}</div>${zeitraum ? `<p class="v19125-zeitraum">${safe(zeitraum)}</p>` : ""}<div class="v19125-wasserzeichen" aria-hidden="true">✥</div>`;
    });
    qa(".buch-seite,.buch-kapitel",root).forEach(s=>{if(!s.textContent.trim()&&!s.querySelector("img,table,svg"))s.remove();});
  };
  const berichtAusgabe = q("#berichtAusgabe");
  if (berichtAusgabe) new MutationObserver(() => titelblattVerbessern(berichtAusgabe)).observe(berichtAusgabe, {childList:true,subtree:true});
  titelblattVerbessern(document);

  // Das bisherige Druckzentrum vollständig durch eine eindeutige Logik ersetzen.
  q("#seite-drucken")?.remove();
  const seite = document.createElement("section");
  seite.className = "seite"; seite.id = "seite-drucken";
  seite.innerHTML = `<button class="knopf sekundaer zur-uebersicht" type="button" data-zur>← Zur Übersicht</button><div class="v19121-seitenkopf"><div><h2>Druckzentrum</h2><p>Wählen Sie den Inhalt aus. Es werden nur die dazu passenden Einstellungen angezeigt.</p></div></div><p class="v19128-druckhinweis"><strong>Klare Zuständigkeit:</strong> Hier drucken Sie Listen, Termine, Dokumentübersichten und Verläufe. Persönliche Ausgaben erstellen und drucken Sie ausschließlich im Berichts-, Tagebuch- und Buchzentrum.</p><article class="karte"><h3>Was möchten Sie drucken?</h3><div id="v19125Druckarten"></div><div class="v19125-druckfilter"><label>Von<input class="filter" id="v19125Von" type="date"></label><label>Bis<input class="filter" id="v19125Bis" type="date"></label><label id="v19125ArztLabel">Arzt / Stelle<select class="filter" id="v19125Arzt"><option value="">Alle Ärzte / Stellen</option></select></label><label>Druckdichte<select class="filter" id="v19125Dichte"><option value="lesbar">Gut lesbar – empfohlen</option><option value="sparsam">Papiersparend</option></select></label></div><fieldset id="v19125DiagrammBox" class="v19125-zusatz" hidden><legend>Diagramme auswählen</legend><div class="v19123-diagrammauswahl" id="v19125Diagramme"></div></fieldset><div class="v19125-format" id="v19125Format"></div><div class="v19123-druckaktionen"><button class="knopf" type="button" id="v19125Drucken">🖨 Drucken oder als PDF speichern</button></div><p class="hinweis">Im Druckfenster können Sie einen Drucker auswählen oder die Ausgabe als PDF speichern.</p></article><article class="v19123-vorschau" id="v19125Vorschau" aria-live="polite"></article>`;
  q("main").appendChild(seite);
  q("[data-zur]", seite).addEventListener("click", () => typeof wechsleSeite === "function" && wechsleSeite("cockpit"));
  const arten = [["fragen","Offene Fragen"],["kommend","Kommende Termine mit Fragen"],["vergangen","Vergangene Termine"],["alletermine","Alle Termine"],["medikamente","Medikamentenplan"],["behandlung","Behandlung & Medikamente"],["nebenwirkungen","Beobachtete Nebenwirkungen"],["schritte","Behandlungsschritte"],["dokumente","Liste meiner Dokumente"],["verlauf","Verlauf"],["diagramme","Ausgewählte Diagramme"]];
  const druckGruppen=[["Termine und Fragen",["kommend","fragen","vergangen","alletermine"]],["Behandlung",["medikamente","behandlung","nebenwirkungen","schritte"]],["Dokumentation und Verlauf",["dokumente","verlauf","diagramme"]]];
  q("#v19125Druckarten").innerHTML=druckGruppen.map((g,gi)=>`<fieldset class="v19126-druckgruppe"><legend>${g[0]}</legend><div class="v19123-druckauswahl">${g[1].map(v=>{const a=arten.find(x=>x[0]===v);return `<label><input type="radio" name="v19125-art" value="${a[0]}" ${gi===0&&v==="kommend"?"checked":""}> ${a[1]}</label>`}).join("")}</div></fieldset>`).join("");
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
  // Kosten werden nur noch auf der zentralen Kostenseite gedruckt.
  const kostenSeite=q("#seite-kosten"), kostenDruck=document.createElement("article");
  kostenDruck.id="v19126KostenDruck";kostenDruck.className="karte v19126-kostendruck";kostenDruck.hidden=true;
  kostenDruck.innerHTML=`<div class="abschnitt-titel"><div><h3>Kostenbericht erstellen</h3><p>Zeitraum und Kostenart werden aus der Kostenübersicht übernommen.</p></div><button class="knopf sekundaer" type="button" id="v19126KostenSchliessen">Schließen</button></div><fieldset class="v19125-zusatz"><legend>Ausgabeart</legend><label><input type="radio" name="v19126-kostenmodus" value="kurz"> Kurzübersicht</label><label><input type="radio" name="v19126-kostenmodus" value="voll" checked> Vollständiger Kostennachweis</label></fieldset><div id="v19126KostenVorschau"></div><div class="v19123-druckaktionen"><button class="knopf" type="button" id="v19126KostenDrucken">🖨 Drucken oder als PDF speichern</button></div>`;
  kostenSeite?.appendChild(kostenDruck);
  const kostenPosten=()=>{const von=q("#kostenVon")?.value||"0000-01-01",bis=q("#kostenBis")?.value||"9999-12-31",wahl=q("#kostenArt")?.value||"alle",namen={rechnung:"Rechnung",rezept:"Rezept",fahrt:"Fahrtkosten"};return daten.eintraege.flatMap(e=>["rechnung","rezept","fahrt"].filter(a=>(wahl==="alle"||wahl===a)&&e.datum>=von&&e.datum<=bis&&Number(e[a])>0).map(a=>({datum:e.datum,art:a,artname:namen[a],betrag:Number(e[a]),text:e.arzt||e.massnahme||e.bemerkung||"Ohne Bezeichnung"}))).sort((a,b)=>String(b.datum).localeCompare(String(a.datum)));};
  const kostenVorschau=()=>{const ps=kostenPosten(),sum=a=>ps.filter(p=>p.art===a).reduce((s,p)=>s+p.betrag,0),r=sum("rechnung"),z=sum("rezept"),f=sum("fahrt"),g=r+z+f,voll=q('[name="v19126-kostenmodus"]:checked')?.value==="voll",von=q("#kostenVon")?.value,bis=q("#kostenBis")?.value,zeit=[von?formatDatum(von):"Beginn",bis?formatDatum(bis):"heute"].join(" bis ");q("#v19126KostenVorschau").innerHTML=`<header class="v19125-druckkopf"><h2>Kostenübersicht</h2><div>Zeitraum: ${safe(zeit)}</div></header><div class="v19123-kosten"><div>Rechnungen<strong>${formatEuro(r)}</strong></div><div>Rezepte<strong>${formatEuro(z)}</strong></div><div>Fahrtkosten<strong>${formatEuro(f)}</strong></div><div>Gesamtkosten<strong>${formatEuro(g)}</strong></div></div><h3>Verteilung nach Kostenart</h3><div class="v19126-verteilung"><span>Rechnungen ${formatEuro(r)}</span><span>Rezepte ${formatEuro(z)}</span><span>Fahrtkosten ${formatEuro(f)}</span></div>${voll?`<h3>Einzelposten</h3>${tabelle(["Datum","Kostenart","Bezeichnung / Empfänger","Betrag"],ps.map(p=>`<tr><td>${formatDatum(p.datum)}</td><td>${p.artname}</td><td>${safe(p.text)}</td><td>${formatEuro(p.betrag)}</td></tr>`))}<p class="v19125-gesamtsumme"><strong>Gesamtsumme: ${formatEuro(g)}</strong></p>`:""}`;};
  q("#kostenBerichtErstellen")?.addEventListener("click",()=>{kostenDruck.hidden=false;kostenVorschau();kostenDruck.scrollIntoView({behavior:"smooth",block:"start"});});
  q("#v19126KostenSchliessen")?.addEventListener("click",()=>{kostenDruck.hidden=true;});
  kostenDruck.addEventListener("change",kostenVorschau);["kostenVon","kostenBis","kostenArt"].forEach(id=>q(`#${id}`)?.addEventListener("change",()=>{if(!kostenDruck.hidden)kostenVorschau();}));
  q("#v19126KostenDrucken")?.addEventListener("click",async()=>{kostenVorschau();ausrichtungsStil.textContent="@media print{@page{size:A4 portrait;margin:14mm}}";document.body.classList.add("v19126-kosten-druckt");await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));window.print();});
  const vorschau = async () => {
    const a=art(), out=q("#v19125Vorschau"), quer=["verlauf","diagramme"].includes(a), titel=arten.find(x=>x[0]===a)?.[1]||"Ausdruck";
    q("#v19125DiagrammBox").hidden=a!=="diagramme";
    q("#v19125ArztLabel").hidden=["verlauf","diagramme","medikamente"].includes(a);
    const formatHinweis=q("#v19125Format"), druckKnopf=q("#v19125Drucken");
    formatHinweis.classList.toggle("v19128-querhinweis",quer);
    formatHinweis.textContent=quer?"Wichtig: Bitte wählen Sie im folgenden Druckfenster Querformat.":"Druckformat: DIN A4 hoch.";
    druckKnopf.textContent=quer?"🖨 Drucken – anschließend Querformat wählen":"🖨 Drucken oder als PDF speichern";
    let html="";
    if(a==="fragen"){
      const offene=daten.fragen.filter(f=>!f.erledigt).filter(beimArzt).sort((x,y)=>{const tx=daten.eintraege.find(e=>e.id===x.terminId),ty=daten.eintraege.find(e=>e.id===y.terminId);return String(tx?.datum||"9999").localeCompare(String(ty?.datum||"9999"));});
      html=tabelle(["Termin am","Arzt / Stelle","Offene Frage"],offene.map(f=>{const t=daten.eintraege.find(e=>e.id===f.terminId);return `<tr><td>${t?formatDatum(t.datum):"Noch nicht zugeordnet"}${f.erfasstAm?`<small>Frage erfasst am ${formatDatum(f.erfasstAm)}</small>`:`<small>Erfassungsdatum nicht vorhanden</small>`}</td><td>${safe(f.arzt||t?.arzt||"Allgemein")}</td><td>${safe(f.text)}</td></tr>`;}));
    } else if(a==="kommend") {
      const ts=alleTermine().filter(imZeitraum).filter(beimArzt).filter(istKommenderTermin).sort((x,y)=>zeitSchluessel(x).localeCompare(zeitSchluessel(y))); html=terminFragen(ts);
    } else if(["vergangen","alletermine"].includes(a)) {
      let ts=alleTermine().filter(imZeitraum).filter(beimArzt); if(a==="vergangen")ts=ts.filter(e=>!istKommenderTermin(e)); ts.sort((x,y)=>zeitSchluessel(x).localeCompare(zeitSchluessel(y))); html=tabelle(["Datum","Arzt / Stelle","Termin","Status"],ts.map(e=>`<tr><td>${formatDatum(e.datum)}${e.messUhrzeit?`<br>${safe(e.messUhrzeit)} Uhr`:""}</td><td>${safe(e.arzt||"")}</td><td>${safe(e.massnahme||e.bemerkung||"")}</td><td>${safe(terminStatus(e))}</td></tr>`));
    } else if(a==="medikamente") html=tabelle(["Medikament","Anwendung","Abstand"],daten.medikamente.map(m=>`<tr><td>${safe(m.name)}</td><td>${safe(m.anwendung||m.zeit||"")}</td><td>${m.weitereGeplant===false?"Behandlung beendet":safe(m.abstand?`${m.abstand} ${m.einheit||"Tage"}`:"")}</td></tr>`));
    else if(a==="nebenwirkungen") html=tabelle(["Datum","Medikament","Beobachtung"],daten.nebenwirkungen.filter(imZeitraum).map(n=>`<tr><td>${formatDatum(n.datum)}</td><td>${safe(n.medName||"")}</td><td>${safe(n.beschwerde||"")}</td></tr>`));
    else if(a==="schritte") html=tabelle(["Datum","Behandlungsschritt","Ort / Stelle","Status"],daten.schritte.filter(imZeitraum).map(s=>`<tr><td>${formatDatum(s.datum)}</td><td>${safe(s.titel||s.name||s.massnahme||"")}</td><td>${safe(s.ort||s.stelle||s.arzt||"")}</td><td>${safe(s.status||"")}</td></tr>`));
    else if(a==="behandlung") html=`<h3>Medikamentenplan</h3>${tabelle(["Medikament","Anwendung"],daten.medikamente.map(m=>`<tr><td>${safe(m.name)}</td><td>${safe(m.anwendung||m.zeit||"")}</td></tr>`))}<h3>Behandlungsschritte</h3>${tabelle(["Datum","Behandlungsschritt","Status"],daten.schritte.filter(imZeitraum).map(s=>`<tr><td>${formatDatum(s.datum)}</td><td>${safe(s.titel||s.name||s.massnahme||"")}</td><td>${safe(s.status||"")}</td></tr>`))}`;
    else if(a==="dokumente") {await dokumenteLaden(); const v=q("#v19125Von").value||"0000-01-01",b=q("#v19125Bis").value||"9999-12-31"; const ds=druckDokumente.filter(d=>{const dt=d.dokumentDatum||d.datum||(d.erstellt||"").slice(0,10);return dt>=v&&dt<=b&&beimArzt(d);}); html=`<p class="v19124-erklaerung">Übersicht der gespeicherten Dokumente. Die Dokumentinhalte selbst werden nicht gedruckt.</p>${tabelle(["Datum","Dokument","Kategorie","Arzt / Stelle","Seiten"],ds.map(d=>`<tr><td>${formatDatum(d.dokumentDatum||d.datum||(d.erstellt||"").slice(0,10))}</td><td>${safe(d.name||"Dokument")}</td><td>${safe(d.kategorie||"Sonstiges")}</td><td>${safe(d.quelleName||"")}</td><td>${d.seiten?.length||1}</td></tr>`))}`;}
    else if(["verlauf","diagramme"].includes(a)) {const vf=q("#verlaufVon"),vb=q("#verlaufBis");if(vf)vf.value=q("#v19125Von").value;if(vb)vb.value=q("#v19125Bis").value;if(typeof renderVerlauf==="function")renderVerlauf();const ids=a==="verlauf"?diagramme.map(d=>d[0]):qa("#v19125Diagramme input:checked").map(i=>i.value);const cards=ids.map(id=>q(`#${id}`)?.closest("article")).filter(Boolean).filter(c=>!q(".diagramm.ist-leer",c));html=cards.length?`<div class="v19125-diagramme">${cards.map(c=>`<section class="v19125-diagramm">${c.innerHTML}</section>`).join("")}</div>`:`<div class="v19123-leer">Für die Auswahl sind noch keine bewerteten Werte vorhanden.</div>`;if(a==="verlauf"&&q("#behandlungVerlauf"))html+=`<section class="v19125-behandlung"><h3>Behandlungsverlauf</h3>${q("#behandlungVerlauf").innerHTML}</section>`;}
    out.className=`v19123-vorschau${q("#v19125Dichte").value==="sparsam"?" v19123-sparsam":""}${quer?" v19125-quer":" v19125-hoch"}`; out.innerHTML=kopf(titel)+html;
  };
  let timer=0; const planen=()=>{clearTimeout(timer);timer=setTimeout(vorschau,80);};
  seite.addEventListener("change", planen); qa("#v19125Von,#v19125Bis",seite).forEach(x=>x.addEventListener("input",planen));
  const ausrichtungsStil=document.createElement("style");ausrichtungsStil.id="v19126Druckausrichtung";document.head.appendChild(ausrichtungsStil);
  q("#v19125Drucken").addEventListener("click", async()=>{await vorschau();ausrichtungsStil.textContent="";document.body.classList.add("v19125-druckt");await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));window.print();});
  window.addEventListener("afterprint",()=>{document.body.classList.remove("v19125-druckt","v19126-kosten-druckt");ausrichtungsStil.textContent="";});
  vorschau();
})();
