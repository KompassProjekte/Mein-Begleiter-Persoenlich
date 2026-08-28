# Verbindlicher Entwicklungsauftrag

## Mein Begleiter 1.9.1.2.3 PWA – Druckzentrum, Ansichten und Terminfilter

Nimbus, entwickle auf Grundlage der zuletzt geprüften Version

`Mein_Begleiter_1.9.1.2.2_PWA_ANSICHT_DRUCK_VERLAUF.zip`

die neue persönliche Test- und Arbeitsversion:

`Mein_Begleiter_1.9.1.2.3_PWA_DRUCKZENTRUM_ANSICHTEN_TERMINE.zip`

Die Version 1.9.1.2.2 muss unverändert erhalten bleiben.

## 1. Grundsätze

- Bestehende Nutzerdaten und Dokumente müssen erhalten bleiben.
- Lokale Speicherkennungen und Datenstrukturen dürfen nicht verändert werden.
- Die vollständige verschlüsselte Sicherung bleibt kompatibel.
- Sicherungen aus Version 1.9.1.2.2 müssen eingelesen werden können.
- Keine automatische Synchronisation.
- Keine Cloud-Speicherung und keine Benutzerkonten.
- Keine persönlichen Daten in Programmdateien, URLs, Protokollen oder Service-Worker-Caches.
- Die Auslieferung erfolgt mit 0 persönlichen Datensätzen.
- Test ausschließlich mit erfundenen Daten.
- Bestehende und bereits bestandene Funktionen dürfen nicht verschlechtert werden.

## 2. Ansichtsumschaltung vollständig reparieren

Die Umschaltung zwischen „Einfache Ansicht“ und „Vollständige Ansicht“ funktioniert in Version 1.9.1.2.2 noch nicht zuverlässig.

Verbindliche Anforderungen:

- Es darf immer nur eine Ansicht als aktiv gekennzeichnet sein.
- Die aktive Ansicht erhält:
  - dunkelgrünen Hintergrund,
  - gut sichtbares Häkchen,
  - eindeutige Beschriftung.
- Die nicht aktive Ansicht erhält:
  - hellen Hintergrund,
  - grünen Rahmen,
  - kein Häkchen.
- Zusätzlich erscheint:

  **„Aktuelle Ansicht: Einfache Ansicht“**

  beziehungsweise:

  **„Aktuelle Ansicht: Vollständige Ansicht“**
- Der Wechsel erfolgt sofort und ohne Neuladen.
- Die Navigation wird beim Umschalten unmittelbar neu aufgebaut.
- Die gewählte Ansicht wird lokal auf dem jeweiligen Gerät gespeichert.
- Nach dem erneuten Öffnen der Anwendung bleibt die Auswahl erhalten.
- Der Wechsel verändert oder löscht keine Daten.

### Einfache Ansicht

Unmittelbar sichtbar:

- Meine Übersicht
- Meine Einträge
- Termine
- Behandlung
- Dokumente
- Sicherung
- Einstellungen
- Hilfe & Anleitung

### Vollständige Ansicht

Zusätzlich unmittelbar sichtbar:

- Bericht
- Kosten
- Verlauf
- Drucken

Alle vorhandenen Funktionen bleiben in beiden Ansichten erhalten.

## 3. Zentrales Druckzentrum

In der vollständigen Ansicht wird ein eigener Menüpunkt ergänzt:

**„🖨 Drucken“**

Dieser öffnet eine eigenständige Seite:

**„Druckzentrum“**

Dort werden alle druckbaren Inhalte zentral und verständlich angeboten.

### Druckbare Inhalte

- Offene Fragen
- Kommende Termine
- Vergangene Termine
- Alle Termine
- Medikamentenplan
- Behandlungsübersicht
- Beobachtete Nebenwirkungen
- Behandlungsschritte
- Dokumentenverzeichnis
- Kostenübersicht
- Verlauf
- ausgewählte Diagramme
- Tagebuch
- Persönliches Buch

### Druckauswahl

Je nach Druckart sollen angeboten werden:

- Zeitraum
- Arzt beziehungsweise Behandlungsstelle
- einzelne Diagramme
- nur offene beziehungsweise nur relevante Einträge
- Druckdichte
- Vorschau
- Drucken
- als PDF speichern, soweit vom Browser unterstützt

### Druckdichte

Zwei verständliche Auswahlmöglichkeiten:

- **Gut lesbar – empfohlen**
- **Papiersparend**

„Gut lesbar“ ist die Standardeinstellung.

## 4. Einheitliche Druckgestaltung

Für sämtliche Ausdrucke gilt:

- „Zur Übersicht“ wird nicht gedruckt.
- Navigation und Handy-Menü werden nicht gedruckt.
- Filter und Eingabefelder werden nicht gedruckt.
- Druckknöpfe werden nicht gedruckt.
- „Ändern“, „Löschen“, „Abbrechen“ und andere Bearbeitungsaktionen werden nicht gedruckt.
- Technische Versionsangaben werden nicht gedruckt.
- „Persönliche Arbeitsversion“ wird nicht gedruckt.
- Leere Bereiche werden ausgelassen.
- Nicht ausgewählte Bereiche werden ausgelassen.
- Jeder Fachausdruck enthält ausschließlich den ausgewählten Inhalt.
- Als Kopf genügen:
  - Bezeichnung des Ausdrucks,
  - Erstellungsdatum,
  - gegebenenfalls gewählter Zeitraum.
- Kleine, unaufdringliche Seitenzahlen erscheinen in der Fußzeile.

Beispiele:

- „Offene Fragen – 29.08.2026“
- „Medikamentenplan – 29.08.2026“
- „Kostenübersicht – 29.08.2026“

## 5. Tagebuch- und Buchdruck verbessern

Die Seiten sollen besser ausgenutzt und gleichzeitig gut lesbar bleiben.

Verbindliche Anforderungen:

- Grundschrift in der gut lesbaren Fassung: 11 bis 12 Punkt.
- Angenehmer Zeilenabstand von ungefähr 1,4.
- Gleichmäßige Seitenränder von ungefähr 15 mm.
- Sichtbarer Abstand zwischen zwei Tagen.
- Dünne Trennlinie zwischen den Tagen.
- Datum jedes Tages deutlich hervorheben.
- Ein kurzer Tag darf nicht unnötig eine eigene Seite erhalten.
- Mehrere kurze Tage dürfen auf einer Seite stehen.
- Ein zusammengehöriger Tag soll möglichst nicht getrennt werden.
- Passt ein Tag nicht vollständig auf die aktuelle Seite, beginnt er möglichst auf der nächsten Seite.
- Überschriften dürfen nicht allein am Seitenende stehen.
- Keine erzwungene neue Seite nach jedem Eintrag oder Monat.
- Neue Seiten nur bei echten Kapiteln oder größeren Abschnitten.
- Leere Widmungs-, Vorwort-, Kapitel- und Schlussseiten entfallen.
- Keine unbeabsichtigten fast leeren Seiten.
- Der vorhandene Platz wird sinnvoll genutzt.
- Kopfzeile bei mehrseitigen Ausgaben:
  - Tagebuch- oder Buchtitel,
  - gewählter Zeitraum.
- Fußzeile:
  - Seitenzahl.

## 6. Kostenübersicht

Die vollständige Kostenübersicht soll möglichst auf eine DIN-A4-Seite passen.

Sie enthält:

- Rechnungen
- Rezepte
- Fahrten
- Gesamtsumme
- kompakte Verteilung nach Kostenart

Anforderungen:

- gut lesbare Schrift,
- kleinere, gleichmäßige Abstände,
- keine unnötig großen Karten,
- keine zweite Seite nur für die Verteilung,
- Einzelposten nur dann, wenn sie im Druckzentrum ausdrücklich ausgewählt wurden.

## 7. Terminfilter professionell neu ordnen

Der bisherige Filter „Herkunft“ bleibt entfernt.

Statt getrennter und widersprüchlicher Filter erhält die Terminseite eine gemeinsame Filterleiste.

### Auswahl „Welche Termine?“

- Kommende Termine
- Vergangene Termine
- Alle Termine

### Zeitraum

- Nächste 30 Tage
- Nächste 3 Monate
- Letzte 3 Monate
- Dieses Jahr
- Eigener Zeitraum
- Gesamter Zeitraum

### Weitere Filter

- Arzt beziehungsweise Stelle
- Filter zurücksetzen

### Logik

- „Kommend“ und „Vergangen“ werden anhand des heutigen Datums und des Terminstatus bestimmt.
- Erledigte und abgesagte Termine gelten nicht als kommende Termine.
- Danach wird der gewählte Zeitraum angewendet.
- Zähler müssen der tatsächlich sichtbaren Zahl entsprechen.
- Fragenzuordnung muss nur mit den tatsächlich sichtbaren beziehungsweise passenden Terminen arbeiten.
- Bei „Alle Termine“ werden kommende und vergangene Termine in zwei getrennten Abschnitten angezeigt.
- Bei „Kommende Termine“ wird nur dieser Abschnitt angezeigt.
- Bei „Vergangene Termine“ wird nur dieser Abschnitt angezeigt.
- Es dürfen keine Termine außerhalb des gewählten Zeitraums erscheinen.
- Der Filter muss auf PC, Tablet und Handy gleich funktionieren.

## 8. Verlauf und Diagramme erhalten

Die Verbesserungen aus Version 1.9.1.2.2 bleiben erhalten:

- kompakte Diagramme,
- keine Null-Linien für fehlende Werte,
- Einzelwertkarte bei genau einem Messwert,
- Verlaufslinie erst ab zwei Messwerten,
- Datumsfilter,
- Atemfrequenz,
- einklappbare weitere Diagramme auf dem Handy,
- Behandlungsverlauf nach sämtlichen Diagrammen.

Zusätzlich für den Ausdruck:

- höchstens zwei Diagramme nebeneinander,
- Diagramme ausreichend groß zum Lesen, aber nicht seitenfüllend,
- keine leeren Diagramme drucken,
- einzelne Werte als kompakte Wertekarte drucken,
- Behandlungsverlauf nach den ausgewählten Diagrammen,
- Seitenumbruch vor dem Behandlungsverlauf nur dann, wenn er nicht sinnvoll auf die aktuelle Seite passt.

## 9. Bereits bestandene Punkte schützen

Folgende Punkte gelten als bestanden und dürfen nicht wieder verschlechtert werden:

- „Zur Übersicht“ erscheint nicht mehr im Ausdruck.
- Behandlungsplan und einzelne Behandlungsformulare funktionieren.
- Es öffnet sich immer nur ein Behandlungsformular.
- Mehrfachauswahl bei Nebenwirkungen funktioniert.
- Eigene Beschwerden werden erneut angeboten.
- Eigene Behandlungsorte und ausführende Stellen werden erneut angeboten.
- Alte unverschlüsselte Sicherungen sind nicht mehr sichtbar.
- Sicherung ohne Dokumente ist nicht mehr sichtbar.
- Die beiden vollständigen verschlüsselten Sicherungsaktionen funktionieren.
- Einstellungen und Hilfe sind als eigene Seiten erreichbar.
- Behandlungsverlauf steht hinter den Diagrammen.
- Daten und Dokumente bleiben lokal gespeichert.

## 10. Smartphone und Tablet

- Druckzentrum muss auf kleinen Bildschirmen vollständig scrollbar sein.
- Auswahlfelder und Schaltflächen dürfen sich nicht überlagern.
- Keine waagerechten Bildlaufleisten.
- Ausreichend große Schaltflächen.
- Im Querformat darf nichts abgeschnitten werden.
- Android-Navigationsleisten und Sicherheitsbereiche berücksichtigen.
- Tablet bleibt beim Drehen als Tablet erkennbar.
- Die Geräteklasse darf nicht allein wegen Hoch- oder Querformat wechseln.

## 11. Versionsangaben

Alle sichtbaren und technischen Versionsangaben müssen einheitlich lauten:

**„Version 1.9.1.2.3 PWA – Persönliche Arbeitsversion“**

Der Service-Worker-Cache muss eindeutig auf Version 1.9.1.2.3 geändert werden.

## 12. Technische Abschlussprüfung

Vor der Lieferung mindestens prüfen:

- JavaScript-Syntax
- HTML-Grundstruktur
- keine doppelten Elementkennungen
- gültiges Manifest
- gültiger Service Worker
- leerer Startdatenbestand
- bestehende lokale Speicherkennungen unverändert
- Sicherungskompatibilität mit Version 1.9.1.2.2
- Ansichtswechsel ohne Neuladen
- eindeutige aktive Ansicht
- Terminfilter für kommende, vergangene und alle Termine
- Druckzentrum vollständig erreichbar
- alle Fachausdrucke ohne Bedienoberfläche
- Buch- und Tagebuchdruck ohne unbeabsichtigte Leerseiten
- Kostenübersicht auf einer DIN-A4-Seite
- Smartphone-Hochformat
- Smartphone-Querformat
- Samsung A9 Hoch- und Querformat
- PC bei 100, 125 und 150 Prozent Browser-Zoom
- Onlinebetrieb
- Offlinebetrieb nach vollständigem Laden

## 13. Lieferumfang

Zu liefern ist:

`Mein_Begleiter_1.9.1.2.3_PWA_DRUCKZENTRUM_ANSICHTEN_TERMINE.zip`

Das Paket enthält mindestens:

- vollständige PWA,
- `index.html`,
- `manifest.webmanifest`,
- `service-worker.js`,
- `offline.html`,
- vollständigen Icon-Ordner,
- diesen Entwicklungsauftrag,
- aktualisierte Bedienungsanleitung,
- Anleitung zum Druckzentrum,
- aktualisierte Installationsanleitung,
- aktualisierte Anleitung zum sicheren Gerätewechsel,
- Datenschutz- und Sicherheitshinweise,
- Änderungsliste,
- technisches Prüfprotokoll,
- vollständigen Abnahmetest,
- GitHub-Upload-Anleitung.

## 14. Verbindliche Freigabeformel

Die Entwicklung beginnt erst mit:

> „Nimbus, entwickle Mein Begleiter 1.9.1.2.3 PWA nach diesem Entwicklungsauftrag.“

Damit ist der nächste Auftrag vollständig vorbereitet. Für heute machen wir Schluss – beim nächsten Mal können wir ihn noch einmal kurz prüfen und anschließend freigeben.