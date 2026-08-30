# Mein Begleiter 1.9.1.2.5.7 PWA – verbindlicher Entwicklungsauftrag

Version 1.9.1.2.5.7 ist eine bereinigte Konsolidierung der bisherigen PC-Version. Ausgangspunkt ist der vollständige Funktionsstand 1.9.1.2.5.6.1; die Fehler dieser Ausgabe werden nicht durch weitere alte Cache-Dateien oder mehrfach sichtbare Bedienwege fortgeschrieben.

Verbindliche Ziele:

- Die Übersicht enthält keinen zweiten Berichtzugang.
- „＋ Vitalwerte eintragen“ ist fest und genau einmal vorhanden.
- Vitalwerte lassen sich speichern, ändern und erneut speichern. Die Eintragsart `vitalwerte` bleibt erhalten; „Vitalwerte – Messung“ bleibt sichtbar und erzeugt keinen Termin.
- Bereits verlorene Vitalwert-Kennzeichnungen werden ausschließlich bei eindeutig reinen Messdatensätzen wiederhergestellt. Werte, Datum, Uhrzeit und Notizen bleiben unverändert.
- Diagramme zeigen jeden tatsächlichen Wert und zu jedem Punkt das Datum; bei mehreren Vitalmessungen zusätzlich die Uhrzeit. Leere Felder werden nicht als Nullwert ausgegeben. Blutdruck zeigt SYS und DIA getrennt.
- Verlauf und Diagramme erhalten unmittelbar vor dem Druck eine A4-Querformatregel.
- Kostenübersicht und Kostendruck bilden einen einzigen Bedienweg auf der Seite „Kosten“. Der allgemeine Druckbereich enthält keine zweite Kostenübersicht.
- Kommende Termine werden gemeinsam mit ihren Fragen gedruckt. Offene Fragen enthalten Terminbezug sowie das vorhandene Erfassungsdatum.
- Das persönliche Buch verwendet das persönliche Logo, keinen technischen Platzhalterzeitraum, keinen doppelten Druckkopf und keine leere Zusatzseite.
- Hilfebereich, Schriftgrößensteuerung, Dokumentkategorien, Sicherung und Gerätewechsel bleiben erhalten.

Technische Konsolidierung:

- Die zusammengeführte Korrekturlogik und ihr Stylesheet erhalten die neuen Namen `v19127.js` und `v19127.css`.
- Der Service Worker verwendet ausschließlich den Cache `mein-begleiter-persoenlich-cache-v1-9-1-2-5-7` und lädt die neuen Dateinamen. Dadurch kann keine alte Zusatzdatei mit einem neuen `index.html` vermischt werden.
- Bestehende Datenstruktur und Sicherungsformat bleiben unverändert. Keine Cloudspeicherung und keine automatische Synchronisation.

Abnahme:

- Syntax-, Manifest-, Struktur- und ZIP-Prüfung.
- DOM-Laufzeittest mit Speichern und Ändern einer Vitalmessung, Kostenweg, Fragendatum, Diagrammwerten, SYS/DIA, Buchprüfung und Querformatregel.
- Abschließender Sicht-, Bedien- und Drucktest durch Lothar auf dem PC; danach wieder der Arbeitsablauf „Lothar testet – Nimbus entwickelt“.
