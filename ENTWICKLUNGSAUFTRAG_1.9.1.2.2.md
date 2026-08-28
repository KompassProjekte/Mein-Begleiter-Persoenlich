# Verbindlicher Entwicklungsauftrag
## Mein Begleiter 1.9.1.2.2 PWA – Ansichts-, Druck- und Verlaufskorrektur

Entwickle auf Grundlage der geprüften Version 1.9.1.2.1 die persönliche Arbeitsversion 1.9.1.2.2. Bestehende Datenstrukturen, lokale Speicherkennungen, Dokumentenspeicher und das vollständige verschlüsselte Sicherungsformat müssen unverändert kompatibel bleiben. Die Auslieferung enthält 0 persönliche Datensätze.

### 1. Ansichten

- Einfache und vollständige Ansicht müssen sich sofort sichtbar unterscheiden.
- Einfache Ansicht zeigt Übersicht, Einträge, Termine, Behandlung, Dokumente, Sicherung, Einstellungen und Hilfe.
- Vollständige Ansicht zeigt zusätzlich Bericht, Kosten und Verlauf.
- Die aktive Auswahl wird eindeutig gekennzeichnet. Kein Neuladen ist erforderlich.

### 2. Termine

- Von-, Bis- und Arzt-/Stellenfilter müssen vor der Darstellung auf die Daten angewendet werden.
- Zähler, Fragenzuordnung und Terminlisten müssen genau dem Filter entsprechen.
- Der Filter „Herkunft“ wird entfernt.

### 3. Fachausdrucke

- „Zur Übersicht“, Navigation, Filter, Eingabefelder, Druckknöpfe, Ändern und Löschen werden niemals gedruckt.
- Fachausdrucke enthalten nur Titel, Erstellungsdatum und den ausdrücklich gewählten Inhalt.
- Offene Fragen, Medikamente, Behandlung und Kosten werden getrennt ausgegeben.
- Leere und nicht ausgewählte Bereiche entfallen.
- Kostenübersicht einschließlich Verteilung passt auf eine DIN-A4-Seite.
- Buch- und Tagebuchdruck enthalten keine Bedienoberfläche und erzeugen keine unbeabsichtigte Leerseite.

### 4. Verlauf

- Diagramme auf PC und Tablet kompakt zweispaltig, auf dem Handy einspaltig.
- Fehlende Werte werden nicht als Null dargestellt.
- Kein Wert: kompakter Hinweis. Ein Wert: Wertekarte. Ab zwei Werten: Verlaufslinie.
- Datumsbeschriftungen bleiben lesbar; Messwerte sind über Beschriftung beziehungsweise Antippen erreichbar.
- Weitere Diagramme sind auf dem Handy einklappbar.
- Der Behandlungsverlauf steht nach sämtlichen Diagrammen.

### 5. Abnahme

- Technische Prüfung von HTML, JavaScript, Manifest, Service Worker, IDs und ZIP.
- Praktischer Test auf PC, Samsung A9 und Smartphone bleibt Bestandteil der Anwenderabnahme.
- Versionsbezeichnung: „Version 1.9.1.2.2 PWA – Persönliche Arbeitsversion“.
- Lieferdatei: `Mein_Begleiter_1.9.1.2.2_PWA_ANSICHT_DRUCK_VERLAUF.zip`.
