# Mein Begleiter 1.9.1.2.5.10 PWA – verbindlicher Entwicklungsauftrag

## Smartphone-Korrektur 5

- Smartphone-Erkennung auch bei desktopähnlich gemeldeter Browserbreite.
- Dunkelgrüner, kompakter App-Kopf mit Buch-Kompass im Hoch- und Querformat.
- Alte helle Seitenleiste auf Smartphones vollständig ausgeblendet.
- Gut erreichbares, innerhalb des Bildschirms scrollbar bleibendes Mobilmenü.
- Ausdrückliche Suche nach einer neuen PWA-Version bei bestehender Internetverbindung.

## Smartphone-Korrektur 6

- Das tatsächlich verwendete Mobilmenü wird dunkelgrün, kompakt und scrollbar dargestellt.
- Die alte helle Seitenleiste wird auf Smartphones vollständig ausgeblendet.
- „Über Mein Begleiter“ und „Systemprüfung“ stehen in den Smartphone-Einstellungen vor den langen Tagescheck-Einstellungen.

Version 1.9.1.2.5.10 ist die aufgeräumte Funktionsversion auf Grundlage der geprüften Version 1.9.1.2.5.7. Sie bündelt die im abgeschlossenen PC-Test gesammelten Korrekturen. Eine gestalterische Neuentwicklung der Buch- und Berichtsausgaben sowie die Anpassung für Samsung A9 und Smartphone gehören ausdrücklich nicht zu dieser Version.

## Verbindlicher Funktionsumfang

- „Meine Geschichte“ enthält keinen direkten Druckknopf. Listen werden ausschließlich über das Druckzentrum ausgegeben.
- Persönliches Buch und Tagebuch werden ausschließlich im Berichts-, Tagebuch- und Buchzentrum erstellt, gespeichert und gedruckt.
- Das allgemeine Druckzentrum enthält keine zweite Kostenübersicht und keine persönlichen Ausgaben.
- Das Druckzentrum erklärt seine Zuständigkeit verständlich.
- Nach dem PC-Abschlusstest werden Verlauf und ausgewählte Diagramme im zuverlässigen A4-Hochformat kompakt untereinander ausgegeben. Ein Querformat-Hinweis ist nicht mehr erforderlich.
- Vitalwerte lassen sich speichern, ändern und erneut speichern. Die Eintragsart `vitalwerte` und die sichtbare Bezeichnung „Vitalwerte – Messung“ bleiben erhalten.
- Diagramme zeigen Messwerte und Datumsangaben; Blutdruck zeigt SYS und DIA getrennt.
- Der zentrale Kostenweg, Termin-/Fragenausdruck, Dokumente, Hilfe, Sicherung und Gerätewechsel bleiben erhalten.

## Technische Konsolidierung

- Neue eindeutige Zusatzdateien `v1912510.js` und `v1912510.css`.
- Neuer Service-Worker-Cache `mein-begleiter-persoenlich-cache-v1-9-1-2-5-10`.
- Keine Änderung der Datenstruktur oder des Sicherungsformats.
- Keine Cloudspeicherung und keine automatische Synchronisation.

## Abnahme

- Syntax-, Manifest-, Struktur-, Laufzeit- und ZIP-Prüfung.
- Abschließender Sicht-, Bedien- und realer Drucktest durch Lothar am PC.
- Danach getrennte Entwicklung der Buch- und Berichtsausgaben; anschließend Samsung A9 und Smartphone.
