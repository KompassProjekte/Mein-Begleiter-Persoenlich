Hier ist der verbindliche Entwicklungsauftrag. Er enthält die Ergebnisse des PC-Tests und eine klare Grenze: Zunächst wird nur die **PC-Korrekturversion 1.9.1.2.4** erstellt. Danach folgt der Kontrolltest, bevor wir A9 und Smartphone prüfen.

# Verbindlicher Entwicklungsauftrag

## Mein Begleiter – Version 1.9.1.2.4 PWA

### PC-Korrekturversion der persönlichen Arbeitsversion

Entwickle auf Grundlage der aktuell getesteten:

**Version 1.9.1.2.3 PWA – Persönliche Arbeitsversion**

die neue:

**Version 1.9.1.2.4 PWA – Persönliche Arbeitsversion**

Die Version 1.9.1.2.3 muss unverändert erhalten bleiben.

## 1. Ziel

In Version 1.9.1.2.4 werden die beim vollständigen PC-Test festgestellten Bedienungs-, Darstellungs-, Filter- und Druckprobleme korrigiert.

Diese Version ist zunächst für einen erneuten PC-Kontrolltest bestimmt. Die Anpassungen für Samsung A9 und Smartphone erfolgen erst nach diesem Kontrolltest.

## 2. Schutz der vorhandenen Daten

Verbindliche Anforderungen:

- Bestehende persönliche Daten müssen vollständig erhalten bleiben.
- Bestehende Datenstrukturen dürfen nicht verändert oder neu interpretiert werden.
- Schlüssel und Bezeichnungen im lokalen Browser-Speicher dürfen nicht ohne zwingenden Grund geändert werden.
- Dokumente und Dokumentenmappen müssen erhalten bleiben.
- Das bestehende verschlüsselte Sicherungsformat muss kompatibel bleiben.
- Sicherungen aus Version 1.9.1.2.3 müssen in Version 1.9.1.2.4 eingelesen werden können.
- Vor strukturellen Arbeiten ist intern eine Sicherheitskopie der Ausgangsversion anzulegen.
- Es dürfen keine persönlichen Daten in Programmdateien, Testdateien oder GitHub übernommen werden.
- Keine automatische Synchronisation, keine Cloud-Anbindung und keine neue Datenübertragung entwickeln.

## 3. Navigation vereinfachen

### 3.1 Ansichtswechsel entfernen

Der Wechsel zwischen:

- „Einfache Ansicht“
- „Vollständige Ansicht“

wird vollständig entfernt.

Ebenfalls entfernen:

- „Aktuelle Ansicht: Einfache Ansicht“
- „Aktuelle Ansicht: Vollständige Ansicht“
- zugehörige Erklärungen und gespeicherte Umschaltlogik, soweit deren Entfernung keine Daten gefährdet.

Die Navigation bleibt immer vollständig sichtbar.

Die Auswahl freiwilliger Tagescheck-Werte bleibt unabhängig davon erhalten.

### 3.2 Behandlung und Medikamente

Den Navigationspunkt:

**„Behandlung“**

umbenennen in:

**„Behandlung & Medikamente“**

Auf der gemeinsamen Seite bleiben die Funktionen fachlich getrennt und klar gegliedert:

1. Medikamentenplan
2. Medikamentengabe oder Anwendung dokumentieren
3. beobachtete Nebenwirkungen
4. Behandlungsschritte

Bestehende Datenstrukturen dürfen dabei nicht zusammengelegt werden.

### 3.3 Klare Trennung zwischen Erfassen und Verwalten

Mehrfachzugänge sind nur zulässig, wenn sie unterschiedliche Aufgaben erfüllen:

- „Neue Einträge“ dient dem Erfassen neuer Daten.
- Die jeweilige Fachseite dient dem Ansehen, Filtern, Ändern, Löschen, Auswerten und Drucken.

Beispiel Kosten:

- „Neue Einträge“ → Kosten erfassen
- „Kosten“ → Kosten ansehen, filtern, bearbeiten, auswerten und drucken

Doppelte vollständige Übersichtsseiten sind zu vermeiden.

## 4. Termine und Fragen korrigieren

### 4.1 Terminzeiträume

Termine müssen eindeutig getrennt werden in:

- kommende Termine
- vergangene Termine
- alle Termine

Bei kommenden Terminen werden nur Termine ab dem aktuellen Tag angezeigt.

Bei vergangenen Terminen werden nur Termine vor dem aktuellen Tag angezeigt.

Für vergangene und alle Termine muss ein Zeitraumfilter mit „Von“ und „Bis“ verfügbar sein.

Die Datumsauswahl muss die angezeigten Termine tatsächlich begrenzen.

### 4.2 Herkunft entfernen

Die Auswahl **„Herkunft“** wird entfernt, da sie keinen erkennbaren Nutzen hat und nicht zuverlässig funktioniert.

Der Filter **„Arzt/Stelle“** bleibt erhalten.

### 4.3 Fragen

Offene Fragen bleiben mit einem Termin beziehungsweise einer Arzt-/Behandlungsstelle verknüpfbar.

Termine und Fragen dürfen gemeinsam erreichbar sein, müssen aber als getrennte Aufgaben verständlich bleiben.

## 5. Medikamentenplan verbessern

Die Anzeige:

**„Nächste: …“**

ist ein berechneter Hinweis und kein eigener löschbarer Datensatz.

Ergänze beim Ändern eines Medikaments eine verständliche Auswahl:

**Weitere Einnahme oder Anwendung geplant?**

- Ja
- Nein – Behandlung beendet

Bei „Nein – Behandlung beendet“ gilt:

- der bisherige Medikamenteneintrag bleibt erhalten,
- vergangene Anwendungen bleiben erhalten,
- die Anzeige „Letzte: …“ bleibt bestehen,
- die Anzeige „Nächste: …“ entfällt,
- es wird kein zukünftiger Termin mehr berechnet.

Eine bereits vorhandene Behandlung darf nicht gelöscht werden müssen, nur um den nächsten Termin auszublenden.

## 6. Dokumente verbessern

### 6.1 Dateinamen übernehmen

Nach Auswahl einer Datei wird deren Dateiname automatisch als Dokumenttitel vorgeschlagen.

Dabei:

- Dateiendung entfernen,
- Unterstriche möglichst durch Leerzeichen ersetzen,
- ursprüngliche Schreibweise ansonsten erhalten,
- Titel weiterhin vollständig änderbar lassen,
- einen bereits manuell eingegebenen Titel nicht überschreiben.

Bei mehreren ausgewählten Dateien muss ein sinnvoller Mappenname vorgeschlagen werden, der ebenfalls geändert werden kann.

### 6.2 Zusätzliche Kategorien beim Ändern

Selbst angelegte Dokumentkategorien müssen sowohl beim Hinzufügen als auch beim Ändern eines Dokuments verfügbar sein.

Verbindlich:

- Hinzufügen und Ändern verwenden dieselbe gespeicherte Kategorienliste.
- Die aktuelle Kategorie ist beim Öffnen des Änderungsdialogs ausgewählt.
- Eigene Kategorien bleiben dauerhaft erhalten.
- Eigene Kategorien können erneut ausgewählt werden.
- Keine doppelten Kategorien anlegen.
- Kategorien alphabetisch sortieren.
- „Sonstiges“ steht am Schluss.
- Bestehende Kategoriezuordnungen dürfen nicht verloren gehen.

## 7. Kostenübersicht überarbeiten

### 7.1 Begriffe vereinheitlichen

Die Begriffe:

- „Fahrkarten“
- „Fahrten“

werden überall einheitlich ersetzt durch:

**„Fahrtkosten“**

Dies betrifft Oberfläche, Filter, Auswertung und Ausdruck.

Bestehende gespeicherte Kostendaten müssen weiterhin erkannt werden.

### 7.2 Kostenansicht

Die Kostenübersicht enthält:

- Rechnungen
- Rezepte
- Fahrtkosten
- Gesamt
- Verteilung
- Einzelposten

Der Gesamtbetrag wird automatisch aus den tatsächlich berücksichtigten Kostenarten berechnet.

### 7.3 Druckauswahl

Beim Kostendruck werden angeboten:

1. **Kompakte Gesamtübersicht – empfohlen**
2. **Detaillierter Kostennachweis**
3. **Eigene Auswahl**

Unter „Eigene Auswahl“ können gewählt werden:

- Rechnungen
- Rezepte
- Fahrtkosten
- Verteilung
- Einzelposten

„Gesamt“ ist kein unabhängiges Auswahlkästchen. Der Gesamtbetrag wird passend zu den ausgewählten Kostenarten automatisch berechnet.

Zusätzlich:

- Zeitraum berücksichtigen,
- Einzelposten wahlweise chronologisch oder nach Kostenart,
- Zwischensummen je Kostenart,
- kompakte Gesamtübersicht möglichst auf einer DIN-A4-Seite,
- detaillierte Ausgabe darf mehrere Seiten umfassen,
- keine unnötigen Leerseiten,
- gut lesbare Schrift.

## 8. Zentrales Druckmenü reparieren

### 8.1 Vorschau und Auswahl

Bei Auswahl eines Druckinhalts muss die Vorschau vollständig neu erzeugt werden.

Der Fehler ist zu beheben, dass trotz Auswahl von:

- „Verlauf“
- „Ausgewählte Diagramme“

weiterhin ein vorheriger Inhalt wie das Dokumentenverzeichnis angezeigt wird.

Die drei Funktionen müssen immer dieselben aktuellen Einstellungen verwenden:

- Vorschau aktualisieren
- Drucken
- als PDF speichern

Keine alte Vorschau darf weiterverwendet werden.

### 8.2 Verlauf und Diagramme

Drucken beziehungsweise Speichern als PDF muss funktionieren für:

- gesamten Verlauf,
- einzeln ausgewählte Diagramme,
- frei gewählten Zeitraum,
- ausgewählte Arzt-/Behandlungsstelle, sofern fachlich relevant.

Nur ausgewählte Diagramme werden ausgegeben.

Diagramme müssen vor Öffnen des Druckdialogs vollständig aufgebaut sein.

### 8.3 Eindeutige Druckschaltfläche

Wenn „Als PDF speichern“ lediglich den Druckdialog des Browsers öffnet, werden die bisherigen Schaltflächen zusammengefasst zu:

**„Drucken oder als PDF speichern“**

Darunter steht:

**„Im Druckfenster können Sie einen Drucker wählen oder die Ausgabe als PDF speichern.“**

Keine technisch eigenständige PDF-Erzeugung vortäuschen, wenn sie nicht vorhanden ist.

### 8.4 „Zur Übersicht“ ausblenden

Die Schaltfläche **„Zur Übersicht“** darf in keinem Ausdruck erscheinen.

Dies gilt für:

- Berichte,
- Bücher,
- Tagebuch,
- Termine,
- Fragen,
- Medikamente,
- Behandlung,
- Kosten,
- Verlauf,
- Diagramme,
- Dokumentenliste und alle weiteren Druckausgaben.

Auch Navigation, Bearbeitungsschaltflächen und andere Bedienelemente dürfen nicht mitgedruckt werden.

## 9. Diagramme fachlich korrigieren

### 9.1 Nullwert und fehlende Angabe unterscheiden

Verbindliche Regel:

- bewusst eingegebener Wert `0` ist ein gültiger Wert und wird angezeigt,
- leeres beziehungsweise nicht bewertetes Feld wird nicht als `0` dargestellt,
- fehlende Werte erzeugen keinen Punkt,
- fehlende Werte dürfen nicht automatisch durch eine Linie verbunden werden.

Beim Tagescheck muss bei Schmerz zunächst gelten:

**„Nicht bewertet“**

Erst eine bewusste Auswahl von:

**„0 – kein Schmerz“**

erzeugt einen echten Nullwert.

### 9.2 Leere Diagramme

Enthält ein Diagramm keine echten Werte:

- keine große leere Diagrammfläche anzeigen,
- stattdessen kompakter Hinweis: **„Noch keine Werte erfasst.“**
- leeres Diagramm nicht drucken, außer der Anwender wählt es ausdrücklich.

### 9.3 Größe und Druckaufteilung

Diagramme dürfen im Ausdruck nicht unnötig eine ganze Seite belegen.

Für DIN A4:

- normalerweise zwei gut lesbare Diagramme pro Seite,
- bei einfachen Diagrammen gegebenenfalls vier pro Seite,
- Achsen, Datenpunkte und Beschriftungen müssen lesbar bleiben,
- keine abgeschnittenen Legenden,
- keine unnötig große weiße Fläche,
- sinnvoller Abstand zwischen Datumswerten,
- Behandlungsverlauf erst nach den Diagrammen ausgeben.

## 10. Dokumentenverzeichnis verständlicher machen

Den Druckpunkt:

**„Dokumentenverzeichnis“**

umbenennen in:

**„Liste meiner Dokumente“**

Kurzer Hinweis:

**„Erstellt eine Übersicht Ihrer gespeicherten Dokumente. Die Dokumentinhalte selbst werden nicht gedruckt.“**

Die Liste enthält, soweit vorhanden:

- Dokumentdatum
- Titel
- Kategorie
- Arzt/Stelle
- Anzahl der Seiten

Wenn im gewählten Zeitraum keine Dokumente vorhanden sind:

- Auswahl sichtbar deaktivieren oder eindeutig kennzeichnen,
- Hinweis: **„Keine Dokumente im gewählten Zeitraum.“**
- keine leere Druckseite erzeugen.

## 11. Kennwortanzeige professionell gestalten

In den Kennwortfeldern der verschlüsselten Sicherung erscheint rechts ein Augensymbol.

Funktion:

- Auge: Kennwort anzeigen
- durchgestrichenes Auge: Kennwort verbergen
- beide Kennwortfelder gemeinsam umschalten
- nach Schließen des Fensters immer wieder verborgen starten

Der bisherige leere Auswahlkasten mit dem Text „Kennwort anzeigen“ entfällt.

Das Augensymbol muss:

- ausreichend groß sein,
- per Maus und Tastatur bedienbar sein,
- eine verständliche Bezeichnung für Vorlesefunktionen besitzen,
- nicht mit dem Löschen des Feldinhalts verwechselt werden können.

Funktionslose oder irreführende kleine Auswahlkästchen im Bereich der Kennwortstärke entfernen.

## 12. Hilfe und Erklärungen verbessern

### 12.1 Lesbarkeit

Die Anwendung richtet sich ausdrücklich auch an ältere und sehschwächere Menschen.

Für erklärende Texte gelten:

- mindestens 16 px auf PC und Tablet,
- auf Smartphone möglichst 17 px,
- dunkles Petrol oder eine vergleichbar kontrastreiche Textfarbe,
- Zeilenabstand ungefähr 1,5,
- keine blassgrauen wichtigen Texte,
- ausreichender Abstand zwischen Überschrift und Erklärung,
- klare, kurze Sätze.

Überschriften:

- mindestens 17 bis 18 px,
- deutlich hervorgehoben,
- nicht nur durch Farbe gekennzeichnet.

Bedienfelder:

- mindestens 48 px hoch, sofern sinnvoll,
- große Berührungsfläche,
- sichtbarer Tastaturfokus,
- Symbole immer mit verständlicher Textalternative.

### 12.2 Schriftgrößenauswahl

Ergänze eine zentrale, leicht verständliche Einstellung:

**Schriftgröße**

- Standard
- Groß – empfohlen
- Sehr groß

**„Groß“** ist die Voreinstellung.

Die Einstellung wirkt auf die gesamte Bedienoberfläche und bleibt nach einem Neustart gespeichert.

Die Vergrößerung darf nicht zu abgeschnittenen Texten, überlagerten Schaltflächen oder horizontalem Scrollen führen.

### 12.3 Hilfetexte aktualisieren

Alle Hilfetexte an die neue Navigation anpassen.

Insbesondere entfernen:

- Hinweise auf einfache und vollständige Ansicht,
- veraltete Beschreibungen nicht mehr vorhandener Funktionen,
- technische Begriffe ohne Erklärung.

Der Notfallhinweis erhält:

- größere Schrift,
- kräftigen Dunkelrotton,
- sehr hellen roten Hintergrund,
- klaren Hinweis auf ärztliche Hilfe und Notruf 112.

## 13. Titelseiten professioneller gestalten

Die Titelseiten von Tagebuch und persönlichem Buch erhalten ein ruhiges, professionelles Erscheinungsbild.

Vorgaben:

- sehr heller cremefarbener Hintergrund,
- feiner petrolfarbener Rahmen,
- kleines Kompass-/Leuchtturm-Logo,
- sehr dezentes Wasserzeichen,
- dünne zurückhaltende Goldlinie,
- Haupttitel in Petrol,
- gute Schwarz-Weiß-Druckbarkeit,
- keine überladene Gestaltung.

Als Standard wird der Stil:

**„Persönlich“**

verwendet.

Technische oder überflüssige Angaben entfernen:

- „von mir“
- „Auswahl: Alle Ärzte/Stellen“, wenn tatsächlich kein besonderer Filter gesetzt wurde
- interne Versions- oder Bedienhinweise, sofern sie nicht zum Buchinhalt gehören

Der gewählte Zeitraum darf weiterhin erscheinen.

## 14. Professionelle Druckgestaltung

Für sämtliche Ausdrucke gelten:

- DIN A4 optimieren,
- gut lesbare Schrift,
- keine unnötig kleinen Texte,
- sinnvolle Seitenumbrüche,
- Überschrift nicht von zugehörigem Inhalt trennen,
- Einträge möglichst nicht auf zwei Seiten zerreißen,
- keine fast leeren Folgeseiten,
- keine unnötig großen Karten oder Rahmen,
- ausreichende, aber sparsame Abstände,
- Seitenzahlen bei mehrseitigen Ausgaben,
- Druckdatum dezent anzeigen,
- Bedienelemente vollständig ausblenden,
- auch in Schwarz-Weiß verständlich.

## 15. Keine unnötigen Doppelungen

Prüfe die Oberfläche nochmals auf doppelte Zugänge.

Grundregel:

**Ein Hauptort für Verwaltung – zusätzliche Zugänge nur für eine eindeutige Schnellaktion.**

Beispiele:

- Kosten erfassen unter „Neue Einträge“
- Kosten verwalten unter „Kosten“
- Dokument erfassen unter „Neue Einträge“ oder „Dokumente“
- Dokumente verwalten ausschließlich im Dokumentenzentrum
- Drucken zentral unter „Drucken“
- fachbezogene Druckschaltflächen dürfen das Druckzentrum lediglich mit passender Vorauswahl öffnen

Es dürfen keine voneinander getrennten Drucklogiken für dieselbe Ausgabe entstehen.

## 16. Technische Qualitätsanforderungen

- Keine mehrfach überschriebenen Funktionen ergänzen.
- Keine zusätzlichen Beobachter oder Endlosschleifen einbauen.
- Gemeinsame Funktionen zentral verwenden.
- Formular- und Druckzustände sauber voneinander trennen.
- Nach jeder Druckauswahl alte Vorschauzustände vollständig verwerfen.
- Fehler verständlich anzeigen.
- Bestehende PWA-Funktion erhalten.
- Offline-Funktion erhalten.
- Manifest, Service Worker und Cache eindeutig auf Version 1.9.1.2.4 aktualisieren.
- Nach Aktualisierung darf nicht dauerhaft eine alte Oberfläche aus dem Cache erscheinen.
- Anwendung muss nach dem ersten vollständigen Laden weiterhin offline starten.

## 17. PC-Abnahmetest

Prüfe Version 1.9.1.2.4 auf einem PC mindestens in aktuellen Versionen von Chrome und Firefox.

### Navigation

- Ansichtswechsel nicht mehr vorhanden
- Navigation vollständig
- „Behandlung & Medikamente“ korrekt bezeichnet
- alle Navigationsziele erreichbar

### Datenbestand

- vorhandene Einträge sichtbar
- Termine erhalten
- Medikamente erhalten
- Dokumente und Mappen erhalten
- Kategorien erhalten
- Kosten erhalten
- Tagescheck-Werte erhalten

### Termine

- kommende Termine korrekt
- vergangene Termine korrekt
- „Von“ und „Bis“ wirken
- Arzt-/Stellenfilter wirkt
- Herkunft entfernt

### Medikamente

- Behandlung kann als beendet markiert werden
- nächste Anwendung verschwindet
- bisheriger Verlauf bleibt erhalten

### Dokumente

- Dateiname wird als änderbarer Titel vorgeschlagen
- eigene Kategorien erscheinen beim Ändern
- aktuelle Kategorie bleibt ausgewählt
- Dokumente lassen sich weiterhin öffnen

### Diagramme

- echte Nullwerte sichtbar
- fehlende Werte nicht als Null dargestellt
- leere Diagramme kompakt
- Verlauf und ausgewählte Diagramme druckbar

### Kosten

- „Fahrtkosten“ überall einheitlich
- Filter und Summen korrekt
- kompakte und detaillierte Druckausgabe funktionieren
- Einzelposten und Verteilung auswählbar

### Drucken

Alle Druckarten einzeln prüfen:

- offene Fragen
- kommende Termine
- vergangene Termine
- alle Termine
- Medikamentenplan
- Behandlungsübersicht
- Nebenwirkungen
- Behandlungsschritte
- Liste meiner Dokumente
- Kostenübersicht
- Verlauf
- ausgewählte Diagramme
- Tagebuch
- persönliches Buch

Für jede Ausgabe prüfen:

- Vorschau entspricht der Auswahl
- Drucken funktioniert
- Speichern als PDF über den Browser funktioniert
- „Zur Übersicht“ erscheint nicht
- keine Navigation oder Bearbeitungsschaltflächen
- keine unnötigen Leerseiten
- Schrift gut lesbar
- Seiten sinnvoll aufgeteilt

### Sicherung

- verschlüsselte Sicherung erstellen
- Auge zeigt und verbirgt beide Kennwörter
- Kennwort wird nicht gespeichert
- Sicherung mit richtigem Kennwort einlesbar
- falsches Kennwort führt zu verständlicher Meldung
- vorhandene Sicherung aus Version 1.9.1.2.3 bleibt kompatibel

## 18. Lieferumfang

Liefere nach bestandener Prüfung:

1. vollständige PWA-Version 1.9.1.2.4 als ZIP-Datei
2. vollständige, direkt testbare HTML-/PWA-Dateien
3. kurze Änderungsliste
4. PC-Prüfprotokoll mit allen Abnahmepunkten
5. Hinweis zur sicheren Aktualisierung der persönlichen Arbeitsversion
6. kurze Testliste für Lothar
7. Angabe, welche Punkte erst beim A9- und Smartphone-Test beurteilt werden können

## 19. Verbindliche Grenze

In dieser Version dürfen nicht entwickelt werden:

- automatische Synchronisation
- Cloudspeicherung
- Benutzerkonto
- neue medizinische Bewertung
- automatische Diagnose
- grundlegende Änderung der Datenstruktur
- inkompatibles neues Sicherungsformat
- endgültige gerätespezifische Gestaltung für A9 und Smartphone

A9 und Smartphone werden erst nach bestandenem PC-Kontrolltest geprüft.

## 20. Abschluss

Version 1.9.1.2.4 darf erst als fertig bezeichnet werden, wenn:

- alle PC-Korrekturen umgesetzt sind,
- alle vorhandenen Daten erhalten bleiben,
- Drucken und PDF-Ausgabe zuverlässig funktionieren,
- Sicherungen kompatibel bleiben,
- keine veralteten Hilfetexte vorhanden sind,
- keine Bedienelemente im Ausdruck erscheinen,
- alle Abnahmetests dokumentiert bestanden wurden,
- keine Platzhalter und keine nur optisch simulierten Funktionen vorhanden sind.

Entwickle anschließend die vollständig testbare:

**„Mein Begleiter – Version 1.9.1.2.4 PWA – Persönliche Arbeitsversion“**

und stelle sie zusammen mit Änderungsliste, PC-Prüfprotokoll und Testanleitung zum Herunterladen bereit.