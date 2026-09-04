"use strict";
(() => {
  const VERSION = "1.9.1.2.5.10";
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
  }

  // Reine Tages-Checks aus älteren Eingabemasken dürfen nicht durch die
  // Hilfsbezeichnung „Selbstbehandlung“ als geplante Termine erscheinen.
  let tagescheckAltbestandBereinigt = false;
  daten.eintraege.forEach(e => {
    const reineSelbstbeobachtung = String(e?.arzt || "").trim().toLocaleLowerCase("de-DE") === "selbstbehandlung"
      && typeof hatTageswerte === "function" && hatTageswerte(e);
    if (!reineSelbstbeobachtung) return;
    e.arzt = "";
    e.terminstatus = "";
    tagescheckAltbestandBereinigt = true;
  });
  if (tagescheckAltbestandBereinigt) speichern();

  // Einmalige, verlustfreie Kennzeichnung älterer Datensätze. Danach
  // entscheidet ausschließlich der gespeicherte Eintragstyp über Termine.
  let eintragsartenErgaenzt = false;
  const terminFrageIds = new Set((daten.fragen || []).map(f => f.terminId).filter(Boolean));
  daten.eintraege.forEach(e => {
    if (String(e?.eintragsart || "").trim()) return;
    const arzt = String(e?.arzt || "").trim();
    if (terminFrageIds.has(e.id) || arzt) e.eintragsart = "termin";
    else if (typeof hatTageswerte === "function" && hatTageswerte(e)) e.eintragsart = "tagescheck";
    else e.eintragsart = "eintrag";
    eintragsartenErgaenzt = true;
  });
  if (eintragsartenErgaenzt) {
    speichern();
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

  // Pro Seite darf jeder Schnelleinstieg nur einmal vorhanden sein. Dies
  // schützt auch dann vor Doppelungen, wenn eine ältere PWA-Oberfläche noch
  // kurz vor der Aktualisierung aufgebaut wurde.
  qa(".seite").forEach(bereich => {
    const gesehen = new Set();
    qa('[data-neu][data-befinden="1"]', bereich).forEach(knopf => {
      if (gesehen.has("tagescheck")) knopf.remove();
      else gesehen.add("tagescheck");
    });
  });

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
      const ausgabe = t.firstElementChild?.textContent?.trim() || "Persönliches Buch";
      const h = q("h3", t);
      const unter = q(".untertitel", t);
      const von=q("#berichtVon")?.value||q("#v19125Von")?.value||"", bis=q("#berichtBis")?.value||q("#v19125Bis")?.value||"";
      let zeitraum="";
      if(/^\d{4}-\d{2}-\d{2}$/.test(von)&&/^\d{4}-\d{2}-\d{2}$/.test(bis)) zeitraum=`${formatDatum(von)} bis ${formatDatum(bis)}`;
      else if(typeof berichtEintraege==="function") { const ds=berichtEintraege().map(e=>e.datum).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)).sort(); if(ds.length) zeitraum=`${formatDatum(ds[0])} bis ${formatDatum(ds.at(-1))}`; }
      const akzent = /Lese/i.test(ausgabe) ? '#b58a37' : /Famil/i.test(ausgabe) ? '#2a8077' : '#174d48';
      const signet = `<svg class="v1912510-buchsignet" viewBox="0 0 180 135" role="img" aria-label="Offenes Buch mit Kompass"><rect x="14" y="20" width="152" height="102" rx="20" fill="#f5ebd7"/><path d="M90 105C70 118 45 116 25 101V39C46 51 72 49 90 36Z" fill="#fffdf8" stroke="#174d48" stroke-width="3"/><path d="M90 105C110 118 135 116 155 101V39C134 51 108 49 90 36Z" fill="#fffdf8" stroke="#174d48" stroke-width="3"/><path d="M90 36V105" stroke="#174d48" stroke-width="3"/><g stroke="#b58a37" stroke-width="1.3"><path d="M41 64L78 62M41 77L78 75M41 90L78 88M102 62L139 64M102 75L139 77M102 88L139 90"/></g><circle cx="90" cy="31" r="24" fill="#fffdf8" stroke="#174d48" stroke-width="2.5"/><circle cx="90" cy="31" r="18" fill="none" stroke="#b58a37"/><path d="M90 10L85 31L90 27L95 31Z" fill="#b58a37"/><path d="M90 51L85 31L90 35L95 31Z" fill="#174d48"/><circle cx="90" cy="31" r="2.5" fill="#b58a37"/></svg>`;
      const titelStil = `<style>.buch-titelblatt[data-v19125="1"]{height:257mm!important;min-height:0!important;display:flex!important;flex-direction:column!important;justify-content:flex-start!important;align-items:center!important;padding:18mm!important;box-sizing:border-box!important;background:#fffdf8!important;border:1px solid #d2d8d5!important;position:relative!important;overflow:hidden!important;text-align:center!important}.v1912510-ausgabe{position:absolute;left:14mm;top:14mm;padding:3mm 6mm;border-radius:99px;background:var(--titel-akzent,#174d48);color:#fff;font:800 9pt/1.1 system-ui,sans-serif;text-transform:uppercase}.v1912510-buchsignet{width:58mm;height:43mm;margin-top:39mm;margin-bottom:10mm}.buch-titelblatt[data-v19125="1"] h3{font:800 27pt/1.12 system-ui,sans-serif!important;letter-spacing:.08em!important;text-transform:uppercase;color:#174d48!important;margin:0!important}.buch-titelblatt[data-v19125="1"] .untertitel{font:400 14.5pt/1.3 system-ui,sans-serif!important;color:#b57f22!important;margin:6mm 0 0!important}.v1912510-goldlinie{width:56mm;height:1px;margin:9mm 0 7mm;background:#b58a37}.v19125-zeitraum{display:grid;gap:3mm;margin:0!important;font:11pt/1.35 system-ui,sans-serif!important;color:#18312f}.v19125-zeitraum strong{font-weight:500}.v19125-zeitraum span{color:#64716e}.v1912510-horizont{position:absolute;left:-2%;right:-2%;bottom:0;height:31mm;background:#f5ebd7;clip-path:polygon(0 33%,18% 20%,40% 30%,64% 36%,82% 29%,100% 13%,100% 100%,0 100%)}.v1912510-horizont i{display:block;height:9mm;background:#ddefea;clip-path:polygon(0 36%,18% 22%,40% 32%,64% 40%,82% 32%,100% 15%,100% 63%,82% 48%,64% 55%,40% 48%,18% 38%,0 53%)}.v1912510-horizont:after{content:"";position:absolute;left:0;right:0;top:8mm;height:1.2px;background:#2a8077}.v1912510-titelfuss{position:absolute;left:10mm;right:10mm;bottom:6mm;z-index:2;color:#64716e;font:7.5pt/1.2 system-ui,sans-serif}</style>`;
      t.style.setProperty('--titel-akzent', akzent);
      t.innerHTML = `${titelStil}<div class="v1912510-ausgabe">${safe(ausgabe)}</div>${signet}<h3>${safe(h?.textContent || "Meine Geschichten")}</h3><div class="untertitel">${safe(unter?.textContent || "Gesundheit, Alltag und Erinnerungen")}</div><div class="v1912510-goldlinie"></div>${zeitraum ? `<p class="v19125-zeitraum"><strong>Ausgewählter Zeitraum</strong><span>${safe(zeitraum)}</span></p>` : ""}<div class="v1912510-horizont" aria-hidden="true"><i></i></div><div class="v1912510-titelfuss">Erstellt mit Mein Begleiter&nbsp; · &nbsp;Entwickelt von Lothar &amp; Nimbus</div>`;
    });
    qa(".buch-seite,.buch-kapitel",root).forEach(s=>{if(!s.textContent.trim()&&!s.querySelector("img,table,svg"))s.remove();});
  };
  const berichtAusgabe = q("#berichtAusgabe");
  if (berichtAusgabe) new MutationObserver(() => titelblattVerbessern(berichtAusgabe)).observe(berichtAusgabe, {childList:true,subtree:true});
  // Druck und Dateispeicherung erzeugen die Ausgabe unmittelbar neu. Deshalb
  // muss das bestätigte Titelblatt im selben Ablauf fertig sein und darf nicht
  // erst auf den MutationObserver warten.
  if (typeof renderBericht === "function") {
    const renderBerichtVorTitelblatt = renderBericht;
    renderBericht = function() {
      const ergebnis = renderBerichtVorTitelblatt.apply(this, arguments);
      titelblattVerbessern(berichtAusgabe || document);
      return ergebnis;
    };
  }
  const buchTitelFeld=q("#buchTitel"), buchUntertitelFeld=q("#buchUntertitel");
  if(buchTitelFeld&&!buchTitelFeld.value.trim())buchTitelFeld.value="Meine Geschichten";
  if(buchUntertitelFeld&&!buchUntertitelFeld.value.trim())buchUntertitelFeld.value="Gesundheit, Alltag und Erinnerungen";
  titelblattVerbessern(document);

  // Das bisherige Druckzentrum vollständig durch eine eindeutige Logik ersetzen.
  q("#seite-drucken")?.remove();
  const seite = document.createElement("section");
  seite.className = "seite"; seite.id = "seite-drucken";
  seite.innerHTML = `<button class="knopf sekundaer zur-uebersicht" type="button" data-zur>← Zur Übersicht</button><div class="v19121-seitenkopf"><div><h2>Listen drucken</h2><p>Termine, Fragen, Medikamente, Dokumentübersichten und Verläufe ausgeben.</p></div></div><p class="v19128-druckhinweis"><strong>Hier finden Sie sachliche Listen.</strong> Persönliches Buch, Tagebuch und sachlichen Gesamtbericht finden Sie im Menü unter „Bericht, Tagebuch &amp; Buch“.</p><article class="karte"><h3>Was möchten Sie drucken?</h3><div id="v19125Druckarten"></div><div class="v19125-druckfilter"><label>Von<input class="filter" id="v19125Von" type="date"></label><label>Bis<input class="filter" id="v19125Bis" type="date"></label><label id="v19125ArztLabel">Arzt / Stelle<select class="filter" id="v19125Arzt"><option value="">Alle Ärzte / Stellen</option></select></label><label>Druckdichte<select class="filter" id="v19125Dichte"><option value="lesbar">Gut lesbar – empfohlen</option><option value="sparsam">Papiersparend</option></select></label></div><fieldset id="v19125DiagrammBox" class="v19125-zusatz" hidden><legend>Diagramme auswählen</legend><div class="v19123-diagrammauswahl" id="v19125Diagramme"></div></fieldset><div class="v19125-format" id="v19125Format"></div><div class="v19123-druckaktionen"><button class="knopf" type="button" id="v19125Drucken">🖨 Drucken oder als PDF speichern</button></div><p class="hinweis">Im Druckfenster können Sie einen Drucker auswählen oder die Ausgabe als PDF speichern.</p></article><article class="v19123-vorschau" id="v19125Vorschau" aria-live="polite"></article>`;
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
  kostenDruck.innerHTML=`<div class="abschnitt-titel"><div><h3>Kostenbericht erstellen</h3><p>Zeitraum und Kostenart werden aus der Kostenübersicht übernommen.</p></div><div class="v1912510-kostenbericht-aktionen"><button class="knopf" type="button" id="v19126KostenDrucken">🖨 Drucken oder als PDF speichern</button><button class="knopf sekundaer" type="button" id="v19126KostenSchliessen">Schließen</button></div></div><fieldset class="v19125-zusatz"><legend>Ausgabeart</legend><label><input type="radio" name="v19126-kostenmodus" value="kurz"> Kurzübersicht</label><label><input type="radio" name="v19126-kostenmodus" value="voll" checked> Vollständiger Kostennachweis</label></fieldset><div id="v19126KostenVorschau"></div>`;
  kostenSeite?.appendChild(kostenDruck);
  const kostenPosten=()=>{const von=q("#kostenVon")?.value||"0000-01-01",bis=q("#kostenBis")?.value||"9999-12-31",wahl=q("#kostenArt")?.value||"alle",namen={rechnung:"Rechnung",rezept:"Rezept",fahrt:"Fahrtkosten"};return daten.eintraege.flatMap(e=>["rechnung","rezept","fahrt"].filter(a=>(wahl==="alle"||wahl===a)&&e.datum>=von&&e.datum<=bis&&Number(e[a])>0).map(a=>({datum:e.datum,art:a,artname:namen[a],betrag:Number(e[a]),text:e.massnahme||e.arzt||e.bemerkung||"Ohne Bezeichnung"}))).sort((a,b)=>String(b.datum).localeCompare(String(a.datum)));};
  const kostenVorschau=()=>{const ps=kostenPosten(),sum=a=>ps.filter(p=>p.art===a).reduce((s,p)=>s+p.betrag,0),r=sum("rechnung"),z=sum("rezept"),f=sum("fahrt"),g=r+z+f,voll=q('[name="v19126-kostenmodus"]:checked')?.value==="voll",von=q("#kostenVon")?.value,bis=q("#kostenBis")?.value,termine=ps.map(p=>p.datum).filter(Boolean).sort(),zeit=ps.length?[von?formatDatum(von):formatDatum(termine[0]),bis?formatDatum(bis):formatDatum(termine.at(-1))].join(" bis "):"Noch keine Kosten erfasst";q("#v19126KostenVorschau").innerHTML=`<header class="v19125-druckkopf"><h2>Kostenübersicht</h2><div>${ps.length?`Zeitraum: ${safe(zeit)}`:safe(zeit)}</div></header><div class="v19123-kosten"><div>Rechnungen<strong>${formatEuro(r)}</strong></div><div>Rezepte<strong>${formatEuro(z)}</strong></div><div>Fahrtkosten<strong>${formatEuro(f)}</strong></div><div>Gesamtkosten<strong>${formatEuro(g)}</strong></div></div><h3>Verteilung nach Kostenart</h3><div class="v19126-verteilung"><span>Rechnungen ${formatEuro(r)}</span><span>Rezepte ${formatEuro(z)}</span><span>Fahrtkosten ${formatEuro(f)}</span></div>${voll?`<h3>Einzelposten</h3>${tabelle(["Datum","Kostenart","Bezeichnung / Empfänger","Betrag"],ps.map(p=>`<tr><td>${formatDatum(p.datum)}</td><td>${p.artname}</td><td>${safe(p.text)}</td><td>${formatEuro(p.betrag)}</td></tr>`))}<p class="v19125-gesamtsumme"><strong>Gesamtsumme: ${formatEuro(g)}</strong></p>`:""}`;};
  q("#kostenBerichtErstellen")?.addEventListener("click",()=>{kostenDruck.hidden=false;kostenVorschau();kostenDruck.scrollIntoView({behavior:"smooth",block:"start"});});
  q("#v19126KostenSchliessen")?.addEventListener("click",()=>{kostenDruck.hidden=true;});
  kostenDruck.addEventListener("change",kostenVorschau);["kostenVon","kostenBis","kostenArt"].forEach(id=>q(`#${id}`)?.addEventListener("change",()=>{if(!kostenDruck.hidden)kostenVorschau();}));
  q("#v19126KostenDrucken")?.addEventListener("click",async()=>{kostenVorschau();ausrichtungsStil.textContent="@media print{@page{size:A4 portrait;margin:11mm}}";document.body.classList.add("v19126-kosten-druckt");await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));window.print();});
  const vorschau = async () => {
    const a=art(), out=q("#v19125Vorschau"), titel=arten.find(x=>x[0]===a)?.[1]||"Ausdruck";
    q("#v19125DiagrammBox").hidden=a!=="diagramme";
    q("#v19125ArztLabel").hidden=["verlauf","diagramme","medikamente"].includes(a);
    const formatHinweis=q("#v19125Format"), druckKnopf=q("#v19125Drucken");
    formatHinweis.hidden=true;
    formatHinweis.textContent="";
    druckKnopf.textContent="🖨 Drucken oder als PDF speichern";
    let html="";
    if(a==="fragen"){
      const offene=daten.fragen.filter(f=>!f.erledigt).filter(beimArzt).sort((x,y)=>{const tx=daten.eintraege.find(e=>e.id===x.terminId),ty=daten.eintraege.find(e=>e.id===y.terminId);return String(tx?.datum||"9999").localeCompare(String(ty?.datum||"9999"));});
      html=tabelle(["Datum","Arzt / Stelle","Offene Frage"],offene.map(f=>{const t=daten.eintraege.find(e=>e.id===f.terminId);return `<tr><td>${t?formatDatum(t.datum):"Noch nicht zugeordnet"}${f.erfasstAm?`<small>Frage erfasst am ${formatDatum(f.erfasstAm)}</small>`:`<small>Erfassungsdatum nicht vorhanden</small>`}</td><td>${safe(f.arzt||t?.arzt||"Allgemein")}</td><td>${safe(f.text)}</td></tr>`;}));
    } else if(a==="kommend") {
      const ts=alleTermine().filter(imZeitraum).filter(beimArzt).filter(istKommenderTermin).sort((x,y)=>zeitSchluessel(x).localeCompare(zeitSchluessel(y))); html=terminFragen(ts);
    } else if(["vergangen","alletermine"].includes(a)) {
      let ts=alleTermine().filter(imZeitraum).filter(beimArzt); if(a==="vergangen")ts=ts.filter(e=>!istKommenderTermin(e)); ts.sort((x,y)=>zeitSchluessel(x).localeCompare(zeitSchluessel(y))); html=tabelle(["Datum","Arzt / Stelle","Termin","Status"],ts.map(e=>`<tr><td>${formatDatum(e.datum)}${e.messUhrzeit?`<br>${safe(e.messUhrzeit)} Uhr`:""}</td><td>${safe(e.arzt||"")}</td><td>${safe(e.massnahme||e.bemerkung||"")}</td><td>${safe(terminStatus(e))}</td></tr>`));
    } else if(a==="medikamente") html=tabelle(["Medikament","Anwendung","Abstand"],daten.medikamente.map(m=>`<tr><td>${safe(m.name)}</td><td>${safe(m.anwendung||m.zeit||"")}</td><td>${m.weitereGeplant===false?"Behandlung beendet":safe(m.abstand?`${m.abstand} ${m.einheit||"Tage"}`:"")}</td></tr>`));
    else if(a==="nebenwirkungen") html=tabelle(["Datum","Medikament","Beobachtung"],daten.nebenwirkungen.filter(imZeitraum).map(n=>`<tr><td>${formatDatum(n.datum)}</td><td>${safe(n.medName||"")}</td><td>${safe(n.beschwerde||"")}</td></tr>`));
    else if(a==="schritte") html=tabelle(["Datum / Uhrzeit","Behandlungsschritt","Ort / Stelle","Status"],daten.schritte.filter(imZeitraum).map(s=>`<tr><td>${formatDatum(s.datum)}${s.uhrzeit?`<br>${safe(s.uhrzeit)} Uhr`:""}</td><td>${safe(s.titel||s.name||s.massnahme||"")}</td><td>${safe(s.ort||s.stelle||s.arzt||"")}</td><td>${safe(s.status||"")}</td></tr>`));
    else if(a==="behandlung") html=`<h3>Medikamentenplan</h3>${tabelle(["Medikament","Anwendung"],daten.medikamente.map(m=>`<tr><td>${safe(m.name)}</td><td>${safe(m.anwendung||m.zeit||"")}</td></tr>`))}<h3>Behandlungsschritte</h3>${tabelle(["Datum / Uhrzeit","Behandlungsschritt","Status"],daten.schritte.filter(imZeitraum).map(s=>`<tr><td>${formatDatum(s.datum)}${s.uhrzeit?`<br>${safe(s.uhrzeit)} Uhr`:""}</td><td>${safe(s.titel||s.name||s.massnahme||"")}</td><td>${safe(s.status||"")}</td></tr>`))}`;
    else if(a==="dokumente") {await dokumenteLaden(); const v=q("#v19125Von").value||"0000-01-01",b=q("#v19125Bis").value||"9999-12-31"; const ds=druckDokumente.filter(d=>{const dt=d.dokumentDatum||d.datum||(d.erstellt||"").slice(0,10);return dt>=v&&dt<=b&&beimArzt(d);}); html=`<p class="v19124-erklaerung">Übersicht der gespeicherten Dokumente. Die Dokumentinhalte selbst werden nicht gedruckt.</p>${tabelle(["Datum","Dokument","Kategorie","Arzt / Stelle","Seiten"],ds.map(d=>`<tr><td>${formatDatum(d.dokumentDatum||d.datum||(d.erstellt||"").slice(0,10))}</td><td>${safe(d.name||"Dokument")}</td><td>${safe(d.kategorie||"Sonstiges")}</td><td>${safe(d.quelleName||"")}</td><td>${d.seiten?.length||1}</td></tr>`))}`;}
    else if(["verlauf","diagramme"].includes(a)) {const vf=q("#verlaufVon"),vb=q("#verlaufBis");if(vf)vf.value=q("#v19125Von").value;if(vb)vb.value=q("#v19125Bis").value;if(typeof renderVerlauf==="function")renderVerlauf();const ids=a==="verlauf"?diagramme.map(d=>d[0]):qa("#v19125Diagramme input:checked").map(i=>i.value);const cards=ids.map(id=>q(`#${id}`)?.closest("article")).filter(Boolean).filter(c=>!q(".diagramm.ist-leer",c));html=cards.length?`<div class="v19125-diagramme">${cards.map(c=>`<section class="v19125-diagramm">${c.innerHTML}</section>`).join("")}</div>`:`<div class="v19123-leer">Für die Auswahl sind noch keine bewerteten Werte vorhanden.</div>`;if(a==="verlauf"&&q("#behandlungVerlauf"))html+=`<section class="v19125-behandlung"><h3>Behandlungsverlauf</h3>${q("#behandlungVerlauf").innerHTML}</section>`;}
    out.className=`v19123-vorschau${q("#v19125Dichte").value==="sparsam"?" v19123-sparsam":""} v19125-hoch`; out.innerHTML=kopf(titel)+html;
  };
  let timer=0; const planen=()=>{clearTimeout(timer);timer=setTimeout(vorschau,80);};
  seite.addEventListener("change", planen); qa("#v19125Von,#v19125Bis",seite).forEach(x=>x.addEventListener("input",planen));
  const ausrichtungsStil=document.createElement("style");ausrichtungsStil.id="v19126Druckausrichtung";document.head.appendChild(ausrichtungsStil);
  q("#v19125Drucken").addEventListener("click", async()=>{await vorschau();ausrichtungsStil.textContent="@media print{@page{size:A4 portrait;margin:11mm}}";document.body.classList.add("v19125-druckt");await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));window.print();});
  window.addEventListener("afterprint",()=>{document.body.classList.remove("v19125-druckt","v19126-kosten-druckt");ausrichtungsStil.textContent="";});
  // Qualitätsversion 1.9.1.2.5.10: eindeutige Eingabewege statt versteckter Umwege.
  // Ein Tages-Check ist ein zusammengehöriger Datensatz. Falls eine ältere
  // Programmfassung am selben Zeitpunkt versehentlich zwei Teile erzeugt hat,
  // entfernt ein bestätigter Löschvorgang beide Teile dauerhaft.
  window.loeschen = id => {
    const ziel = daten.eintraege.find(e => e.id === id);
    if (!ziel) return;
    const istCheck = typeof eintragsartVon === "function"
      ? eintragsartVon(ziel) === "tagescheck"
      : (typeof hatTageswerte === "function" && hatTageswerte(ziel));
    const gleichePruefzeit = e => istCheck
      && e.datum === ziel.datum
      && String(e.messUhrzeit || "") === String(ziel.messUhrzeit || "")
      && (typeof eintragsartVon === "function"
        ? eintragsartVon(e) === "tagescheck"
        : (typeof hatTageswerte === "function" && hatTageswerte(e)));
    const ids = new Set(daten.eintraege.filter(e => e.id === id || gleichePruefzeit(e)).map(e => e.id));
    const name = istCheck ? "Tages-Check" : "Eintrag";
    if (!confirm(`${name} vom ${formatDatum(ziel.datum)} vollständig löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden.`)) return;
    daten.eintraege = daten.eintraege.filter(e => !ids.has(e.id));
    daten.fragen.forEach(f => { if (ids.has(f.terminId)) f.terminId = ""; });
    speichern();
    renderAlles();
    toast(`${name} vollständig gelöscht`);
  };

  const dokumentStatus = q("#dokumentStatus");
  if (dokumentStatus && dokumentStatus.textContent.trim() === "Bereit zum Ablegen.") dokumentStatus.hidden = true;
  if (dokumentStatus) new MutationObserver(() => {
    dokumentStatus.hidden = !dokumentStatus.textContent.trim() || dokumentStatus.textContent.trim() === "Bereit zum Ablegen.";
  }).observe(dokumentStatus, {childList:true,subtree:true,characterData:true});

  const einstellungen = q("#seite-einstellungen");
  if (einstellungen && !q("#v19129Ueber", einstellungen)) {
    const ueber = document.createElement("section");
    ueber.id = "v19129Ueber";
    ueber.className = "v19129-ueber";
    ueber.innerHTML = `<h3>Über Mein Begleiter</h3><p><strong>Version ${VERSION} PWA – PERSÖNLICHE ARBEITSVERSION</strong><br>PC-Abschlusskorrektur · Stand: 03.09.2026<br>Entwickelt von Lothar &amp; Nimbus</p><p>Die Gesundheitsdaten werden lokal auf diesem Gerät gespeichert. Es findet keine automatische Synchronisation statt.</p>`;
    einstellungen.appendChild(ueber);
  }

  const behandlungsTitel = q("#seite-behandlung .behandlung-bereich:nth-of-type(4) h3");
  if (behandlungsTitel) behandlungsTitel.textContent = "Behandlung planen oder dokumentieren";
  const behandlungsStart = q("#seite-behandlung .behandlung-bereich:nth-of-type(4) .behandlung-oeffnen");
  if (behandlungsStart) behandlungsStart.textContent = "📅 Behandlung planen oder dokumentieren";
  const schrittTitel = q("#schrittTitel");
  if (schrittTitel) schrittTitel.placeholder = "Behandlung oder nächster Behandlungsschritt";
  const schrittDatum = q("#schrittDatum");
  if (schrittDatum) schrittDatum.required = true;
  const schrittKnopf = q("#schrittHinzufuegen");
  if (schrittKnopf) schrittKnopf.textContent = "＋ Behandlung speichern";

  const kostenDialog = document.createElement("dialog");
  kostenDialog.id = "v1912510KostenDialog";
  kostenDialog.className = "dialog v19129-kostendialog";
  kostenDialog.innerHTML = `<form method="dialog" novalidate><div class="dialog-kopf"><div><h2 id="v1912510KostenTitel">Kosten eintragen</h2><p>Rechnung, Rezept oder Fahrtkosten als eigenen Kostenposten speichern.</p></div><button type="button" class="dialog-x v1912510-dialog-x" data-kosten-abbruch aria-label="Dialog schließen">×</button></div><div class="dialog-inhalt"><p class="v1912510-pflichthinweis">Mit <strong>*</strong> gekennzeichnete Felder müssen ausgefüllt werden.</p><div id="v1912510KostenFehler" class="v1912510-fehler" role="alert" hidden></div><div class="v19129-kostenformular"><label>Datum *<input id="v19129KostenDatum" type="date" required></label><label>Uhrzeit *<input id="v19129KostenZeit" type="time" required></label><label>Kostenart *<select id="v19129KostenArt" required><option value="rechnung">Rechnung</option><option value="rezept">Rezept</option><option value="fahrt">Fahrtkosten</option></select></label><label>Betrag in Euro *<input id="v19129KostenBetrag" type="number" min="0.01" step="0.01" inputmode="decimal" required></label><label class="span2">Bezeichnung / Empfänger *<input id="v19129KostenText" maxlength="160" placeholder="z. B. Praxis, Apotheke oder Fahrt zur Behandlung" required></label><label class="span2">Arzt / Stelle (freiwillig)<input id="v19129KostenArzt" maxlength="100" list="arztVorschlaege"></label><label class="span2">Notiz (freiwillig)<textarea id="v19129KostenNotiz" rows="2" maxlength="240"></textarea></label></div></div><div class="dialog-fuss"><button type="button" class="knopf sekundaer" data-kosten-abbruch>Abbrechen</button><button type="button" class="knopf" id="v19129KostenSpeichern">Kosten speichern</button></div></form>`;
  document.body.appendChild(kostenDialog);
  let kostenBearbeitung = null;
  const kostenFehler = (text, feld) => {
    const box=q("#v1912510KostenFehler"); box.textContent=text; box.hidden=false;
    qa("[required]",kostenDialog).forEach(x=>x.classList.remove("v1912510-ungueltig"));
    feld?.classList.add("v1912510-ungueltig"); feld?.focus();
  };
  const kostenOeffnen = (eintrag=null, art="rechnung") => {
    kostenBearbeitung = eintrag ? {id:eintrag.id,art} : null;
    q("#v1912510KostenTitel").textContent=eintrag?"Kostenposten ändern":"Kosten eintragen";
    q("#v19129KostenDatum").value = eintrag?.datum || heute();
    q("#v19129KostenZeit").value = eintrag?.messUhrzeit || new Date().toTimeString().slice(0,5);
    q("#v19129KostenArt").value = art;
    q("#v19129KostenBetrag").value = eintrag ? Number(eintrag[art]||0).toFixed(2) : "";
    q("#v19129KostenText").value = eintrag?.massnahme || eintrag?.arzt || "";
    q("#v19129KostenArzt").value = eintrag?.arzt || "";
    q("#v19129KostenNotiz").value = eintrag?.bemerkung || "";
    q("#v1912510KostenFehler").hidden=true;
    qa("[required]",kostenDialog).forEach(x=>x.classList.remove("v1912510-ungueltig"));
    kostenDialog.showModal();
  };
  qa("[data-kosten-abbruch]", kostenDialog).forEach(b=>b.addEventListener("click",()=>kostenDialog.close()));
  const kostenKopf = q("#seite-kosten .kopf-aktionen");
  if (kostenKopf) {
    const neu = document.createElement("button");
    neu.type="button"; neu.className="knopf"; neu.id="v19129KostenNeu"; neu.textContent="＋ Kosten eintragen";
    neu.addEventListener("click",()=>kostenOeffnen()); kostenKopf.prepend(neu);
  }
  q("#v19129KostenSpeichern").addEventListener("click",()=>{
    const datum=q("#v19129KostenDatum").value,zeit=q("#v19129KostenZeit").value,art=q("#v19129KostenArt").value,betrag=Number(q("#v19129KostenBetrag").value),bezeichnung=q("#v19129KostenText").value.trim();
    if(!datum){kostenFehler("Bitte das Datum eintragen.",q("#v19129KostenDatum"));return;}
    if(!zeit){kostenFehler("Bitte die Uhrzeit eintragen.",q("#v19129KostenZeit"));return;}
    if(!art){kostenFehler("Bitte die Kostenart auswählen.",q("#v19129KostenArt"));return;}
    if(!Number.isFinite(betrag)||betrag<=0){kostenFehler("Bitte einen Betrag größer als 0 Euro eintragen.",q("#v19129KostenBetrag"));return;}
    if(!bezeichnung){kostenFehler("Bitte Bezeichnung oder Empfänger eintragen.",q("#v19129KostenText"));return;}
    let e;
    if(kostenBearbeitung){e=daten.eintraege.find(x=>x.id===kostenBearbeitung.id);if(!e){kostenFehler("Der Kostenposten wurde nicht gefunden.");return;}e[kostenBearbeitung.art]=0;}
    else {const id=`j${Date.now()}-${Math.random().toString(36).slice(2,7)}`;e=typeof leeresEintragObjekt==="function"?leeresEintragObjekt(id,datum,zeit):{id,datum,messUhrzeit:zeit,arzt:"",massnahme:"",bemerkung:"",rechnung:0,rezept:0,fahrt:0};daten.eintraege.push(e);}
    if(!kostenBearbeitung||e.eintragsart==="kosten")e.eintragsart="kosten";e.datum=datum;e.messUhrzeit=zeit;e.arzt=q("#v19129KostenArzt").value.trim();e.massnahme=bezeichnung;e.bemerkung=q("#v19129KostenNotiz").value.trim();e[art]=betrag;
    const warAenderung=!!kostenBearbeitung;
    try{speichern();kostenDialog.close();toast(warAenderung?"Kostenposten geändert":"Kostenposten gespeichert");setTimeout(()=>{try{renderAlles();}catch(fehler){console.error("Kostenansicht aktualisieren:",fehler);}},0);}catch(fehler){console.error("Kosten speichern:",fehler);kostenFehler("Der Kostenposten konnte nicht gespeichert werden. Bitte erneut versuchen.");}
  });

  window.v1912510KostenBearbeiten=(id,art)=>{const e=daten.eintraege.find(x=>x.id===id);if(e)kostenOeffnen(e,art);};
  window.v1912510KostenLoeschen=(id,art)=>{const e=daten.eintraege.find(x=>x.id===id);if(!e||!confirm("Diesen Kostenposten wirklich löschen?"))return;e[art]=0;const hatKosten=["rechnung","rezept","fahrt"].some(k=>Number(e[k])>0);if(e.eintragsart==="kosten"&&!hatKosten)daten.eintraege=daten.eintraege.filter(x=>x.id!==id);speichern();renderAlles();toast("Kostenposten gelöscht");};

  // Verständliche Namen für die beiden getrennten Ausgabewege.
  const navName=(root,seite,symbol,text)=>{const b=q(`[data-seite="${seite}"]`,root);if(b)b.innerHTML=`<span class="symbol">${symbol}</span>${text}`;};
  navName(document,"bericht","🖨","Bericht, Tagebuch & Buch");
  navName(document,"drucken","📋","Listen drucken");
  const mobilMenue=q("#v19121MobilMenue");
  if(mobilMenue){const b1=q('[data-seite="bericht"]',mobilMenue),b2=q('[data-seite="drucken"]',mobilMenue);if(b1)b1.textContent="🖨 Bericht, Tagebuch & Buch";if(b2)b2.textContent="📋 Listen drucken";}

  // Pflichtfelder in allen PC-Eingabebereichen einheitlich kennzeichnen.
  const pflichtIds=["datum","messUhrzeit","neuEintragDatum","neuEintragZeit","neuEintragText","neuFrageArzt","neuFrageText","neuTerminDatum","neuTerminZeit","neuTerminArzt","neuMedName","neuGabeMed","neuGabeDatum","medName","einnahmeMed","einnahmeDatum","nebenwirkungMed","nebenwirkungDatum","schrittTitel","schrittDatum","schrittUhrzeit","dokumentDatei","dokumentTitel","vitalDatum","vitalZeit","v19129KostenDatum","v19129KostenZeit","v19129KostenArt","v19129KostenBetrag","v19129KostenText"];
  pflichtIds.forEach(id=>q(`#${id}`)?.setAttribute("required",""));
  qa("input[required],select[required],textarea[required]").forEach(feld=>{
    feld.classList.add("v1912510-pflichtfeld");
    feld.setAttribute("aria-required","true");
    const label=feld.closest("label");
    if(label&&!label.dataset.pflichtMarkiert){label.dataset.pflichtMarkiert="1";const textKnoten=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());if(textKnoten&&!textKnoten.textContent.includes("*"))textKnoten.textContent=textKnoten.textContent.trimEnd()+" *";}
    if(!label&&feld.placeholder&&!feld.placeholder.includes("*"))feld.placeholder=feld.placeholder.replace(/\s*$/,"")+" *";
  });
  const pflichtContainer=new Set(qa(".v1912510-pflichtfeld").map(f=>f.closest(".dialog-inhalt,.kompakt-form,form")).filter(Boolean));
  pflichtContainer.forEach(container=>{if(q(".v1912510-pflichthinweis",container))return;const hinweis=document.createElement("p");hinweis.className="v1912510-pflichthinweis";hinweis.innerHTML="Mit <strong>*</strong> gekennzeichnete Felder müssen ausgefüllt werden.";container.prepend(hinweis);});

  const ueberBox=q("#v19129Ueber");
  if(ueberBox)ueberBox.innerHTML=`<h3>Über Mein Begleiter</h3><p><strong>Version ${VERSION} PWA – PERSÖNLICHE ARBEITSVERSION</strong><br>PC-Abschlusskorrektur · Stand: 03.09.2026<br>Entwickelt von Lothar &amp; Nimbus</p><p>Die Gesundheitsdaten werden lokal auf diesem Gerät gespeichert. Es findet keine automatische Synchronisation statt.</p>`;

  // Im Verlauf ist der Tages-Check kein notwendiger zweiter Einstieg. Die
  // Erfassung bleibt auf der Übersicht und unter „Neue Einträge“ erreichbar.
  qa('#seite-verlauf [data-neu][data-befinden="1"]').forEach(b => b.remove());

  // Auf allen Unterseiten bleibt eine einheitliche Rückkehr zum Seitenanfang
  // sichtbar. So ist die Funktion auch ohne vorheriges Scrollen erkennbar.
  if (!q('#v1912510NachOben')) {
    const oben = document.createElement('button');
    oben.id = 'v1912510NachOben';
    oben.type = 'button';
    oben.className = 'knopf v1912510-nach-oben';
    oben.textContent = '↑ Nach oben';
    oben.hidden = true;
    oben.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
    document.body.appendChild(oben);
    const sichtbarkeit = () => {
      oben.hidden = !q('.seite.aktiv:not(#seite-cockpit)');
    };
    window.addEventListener('scroll', sichtbarkeit, {passive:true});
    document.addEventListener('click', e => {
      if (e.target.closest('[data-seite],[data-wechsel],[data-zur]')) setTimeout(sichtbarkeit, 0);
    });
    sichtbarkeit();
  }

  // Read-only-Systemprüfung: Sie verändert weder Gesundheitsdaten noch
  // Dokumente und macht den Zustand der lokalen PWA verständlich sichtbar.
  const pruefSeite = q('#seite-einstellungen');
  if (pruefSeite && !q('#v1912510Systempruefung')) {
    const box = document.createElement('section');
    box.id = 'v1912510Systempruefung';
    box.className = 'v1912510-systempruefung';
    box.innerHTML = `<h3>Systemprüfung</h3><p>Prüft PWA, lokalen Speicher, Datenbezüge und Sicherungsfähigkeit – ohne Daten zu verändern.</p><button class="knopf" type="button" id="v1912510SystemStart">Systemprüfung durchführen</button><div class="v1912510-pruefergebnis" id="v1912510SystemErgebnis" aria-live="polite"></div>`;
    pruefSeite.appendChild(box);
    q('#v1912510SystemStart').addEventListener('click', async () => {
      const ergebnis = q('#v1912510SystemErgebnis');
      const ok = [], hinweise = [];
      const statischeVersion = qa('link[href],script[src]').some(el => (el.getAttribute('href') || el.getAttribute('src') || '').includes('pc-abschluss-1'));
      statischeVersion ? ok.push('Programmdateien gehören zur aktuellen Abschlusskorrektur.') : hinweise.push('Die aktuelle Cache-Kennung ist noch nicht sichtbar. App einmal vollständig neu laden.');
      if ('serviceWorker' in navigator) ok.push(navigator.serviceWorker.controller ? 'PWA-Service-Worker ist aktiv.' : 'PWA-Service-Worker wird unterstützt; nach dem nächsten Neustart wird er aktiv.');
      else hinweise.push('Dieser Browser unterstützt keine installierbare PWA.');
      try { const k='mb-systemtest'; localStorage.setItem(k,'1'); localStorage.removeItem(k); ok.push('Lokaler Datenspeicher ist beschreibbar.'); } catch (_) { hinweise.push('Lokaler Datenspeicher ist nicht beschreibbar.'); }
      const ids = new Set(), doppelteIds = [];
      (daten.eintraege || []).forEach(e => { if (ids.has(e.id)) doppelteIds.push(e.id); ids.add(e.id); });
      const fachSchluessel = new Map();
      (daten.eintraege || []).forEach(e => { const k=[e.eintragsart||'',e.datum||'',e.messUhrzeit||'',e.arzt||'',e.massnahme||''].join('|'); fachSchluessel.set(k,(fachSchluessel.get(k)||0)+1); });
      const doppelteSaetze=[...fachSchluessel.values()].filter(n=>n>1).length;
      (!doppelteIds.length && !doppelteSaetze) ? ok.push('Keine doppelten Eintrags-IDs oder identischen Datensätze gefunden.') : hinweise.push(`${doppelteIds.length} doppelte ID(s), ${doppelteSaetze} mögliche identische Datensatzgruppe(n) gefunden.`);
      const ohneTyp=(daten.eintraege||[]).filter(e=>!String(e.eintragsart||'').trim()).length;
      ohneTyp ? hinweise.push(`${ohneTyp} ältere Einträge besitzen noch keine feste Typkennzeichnung.`) : ok.push('Alle Einträge besitzen eine feste Typkennzeichnung.');
      const terminIds=new Set((typeof alleTermine==='function'?alleTermine():[]).map(t=>t.id));
      const loseFragen=(daten.fragen||[]).filter(f=>f.terminId&&!terminIds.has(f.terminId)).length;
      loseFragen ? hinweise.push(`${loseFragen} offene Frage${loseFragen === 1 ? ' ist' : 'n sind'} einem nicht mehr vorhandenen Termin zugeordnet.`) : ok.push('Alle gespeicherten Terminbezüge der Fragen sind gültig.');
      const kommende=(typeof alleTermine==='function'?alleTermine():[]).filter(t=>typeof istKommenderTermin==='function'&&istKommenderTermin(t)).sort((a,b)=>zeitSchluessel(a).localeCompare(zeitSchluessel(b)));
      ok.push(kommende.length ? `Nächster Termin logisch ermittelt: ${formatDatum(kommende[0].datum)}${kommende[0].messUhrzeit?' · '+kommende[0].messUhrzeit+' Uhr':''}.` : 'Zurzeit ist kein kommender Termin gespeichert.');
      if (globalThis.crypto?.subtle && globalThis.Blob && globalThis.URL) ok.push('Technische Voraussetzungen für Sicherungsdateien sind vorhanden.');
      else hinweise.push('Eine technische Voraussetzung für Sicherungsdateien fehlt.');
      try { const ds=typeof alleDokumente==='function'?await alleDokumente():[]; ok.push(`Dokumentenablage erreichbar: ${ds.length} Dokument(e).`); } catch (_) { hinweise.push('Dokumentenablage konnte nicht gelesen werden.'); }
      if (navigator.storage?.estimate) { try { const s=await navigator.storage.estimate(), frei=Math.max(0,(s.quota||0)-(s.usage||0)); ok.push(`Lokaler Speicher geprüft: ungefähr ${Math.round(frei/1024/1024)} MB frei.`); } catch (_) {} }
      const frageLoesen = loseFragen
        ? `<div class="v1912510-loesung"><p><strong>Lösung:</strong> Öffnen Sie die Terminübersicht und ordnen Sie die Frage einem neuen Termin zu – oder entfernen Sie die alte Zuordnung.</p><button class="knopf" type="button" id="v1912510FrageZuordnen">Frage jetzt zuordnen</button></div>`
        : '';
      ergebnis.innerHTML = `<p class="ok"><strong>${hinweise.length ? 'Prüfung abgeschlossen' : 'Alle Prüfungen ohne Auffälligkeit abgeschlossen'}.</strong></p><ul>${ok.map(x=>`<li class="ok">✓ ${safe(x)}</li>`).join('')}${hinweise.map(x=>`<li class="hinweis-pruefung">Hinweis: ${safe(x)}</li>`).join('')}</ul>${frageLoesen}`;
      q('#v1912510FrageZuordnen', ergebnis)?.addEventListener('click', () => {
        if (typeof wechsleSeite === 'function') wechsleSeite('termine');
        if (typeof renderTermine === 'function') renderTermine();
        requestAnimationFrame(() => {
          const ziel = q('#seite-termine .nicht-zugeordnet');
          ziel?.scrollIntoView({behavior:'smooth', block:'center'});
          ziel?.querySelector('button')?.focus({preventScroll:true});
        });
      });
    });
  }

  vorschau();
})();
