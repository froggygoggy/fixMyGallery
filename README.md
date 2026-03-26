# Fix my Gallery

Fix my Gallery ist eine Android-App auf Basis von React Native, die Nutzer:innen beim Aufräumen ihrer Foto- und Videoordner unterstützt.

## Aktueller Stand

Dieses Repository enthält ein umsetzbares Domain-Fundament für Sprint 1/2:

- Projektstruktur für App-, Domain-, Data- und Platform-Layer.
- Domain-Typen, Modelle und Service-Schnittstellen.
- Queue-Engine für `old`/`new` inklusive 30-Tage-Logik für neue Fotos.
- Zielfortschritts-Service für Zeit-/Anzahl-Pensum.
- Reminder-Entscheidungsservice für "nur benachrichtigen, wenn Aufgaben offen sind".
- Use Cases zum Bauen und Starten einer Session-Queue aus Repository-Daten.
- Empfehlungservice für intelligente Ordnerpriorisierung (zuletzt/häufig verwendet).
- Pinned-Slot-Service + Sort-Action-Planer für schnelle Swipe-Zielauflösung und Aktionsentscheidung am Bildschirmrand.
- Session-State-Machine für Start/Selektion/Action-Apply/Pause/Resume/Goal-Reached/Complete.
- Trash- und Undo-Planung (Delete -> Papierkorb-Einträge, Undo-Operationen) für sichere Sortieraktionen.
- Session-Action-Orchestrator (Swipe -> Aktion -> Trash/Undo -> Session-Fortschritt) als ausführbarer Use Case.
- Onboarding-Validator + Complete-Onboarding-Use-Case für konsistente Erstkonfiguration (Ordner, Pläne, Reminder, 30-Tage-Default).
- App-State-Repository (Onboarding/Pinned-Slots/Folder-Usage) mit In-Memory-Implementierung für persistente Sprint-2-Flows.
- Dashboard-Bootstrap-Use-Case für offene Alt/Neu-Aufgaben, Ordnerfortschritt und Reminder-Entscheidung.
- Prozess-Use-Case für Session-Schritt inkl. Persistenz von Undo/Trash und Dashboard-Refresh in einem Ablauf.
- UI-Adapter-Controller (Onboarding/Dashboard/Session) als Brücke zwischen React-Native-Screens und Domain-Use-Cases.
- Presenter-Layer mit Fehler-Mapping und deutschen UI-Strings (i18n-ready) für screen-nahe Zustände.
- In-Memory-Repository für schnelle Entwicklung und Tests von Domainlogik.
- SQLite-Migrationen für Kern-Tabellen plus Onboarding-/Reminder-/Fenster-Einstellungen sowie pinned slots/folder usage.
- Android-Permission- und MediaStore-Service-Grundgerüste.


## Sprint-2 Status

- ✅ Onboarding validieren und persistieren
- ✅ Dashboard bootstrappen (old/new + reminder + folder progress)
- ✅ Session-Action-Ende-zu-Ende-Orchestrierung inkl. Undo/Trash
- ✅ UI-Adapter-Controller für Onboarding/Dashboard/Session
- ✅ In-Memory-Persistenz für App-State, Undo-History und Trash
- ✅ Integrativer Sprint-2-Flow-Use-Case (Onboarding -> Dashboard -> Session-Step)


## Sprint-3 Status (in Arbeit)

- ✅ Grid-Selection-Service für Multi-Select-Flows
- ✅ Swipe-Intent-Service für konfigurierbare Löschrichtung
- ✅ Use Case für Sortier-Präferenzen (View-Mode, Grid-Größe, Swipe-Richtung)
- ✅ Bulk-Action-Preview-Use-Case inkl. Bestätigungslogik bei großen Löschaktionen
- ✅ Sorting-Session-Presenter für screen-nahe Sortieransicht

## Entwicklung

- `npm run check` führt den TypeScript-Check aus.
- `npm run test` baut die Domain-Module und führt Node-basierte Unit-Tests aus.

## Nächste Schritte

- React-Native-Bootstrap (`react-native init`) integrieren.
- Onboarding-Screens auf Basis der neuen Modelle implementieren.
- Queue-Use-Case mit MediaStore-Scan und UI-Session verbinden.
- Sortier-UI (Grid + Einzelbild) und Aktionen (move/copy/delete) implementieren.
