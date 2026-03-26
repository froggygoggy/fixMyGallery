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
- In-Memory-Repository für schnelle Entwicklung und Tests von Domainlogik.
- SQLite-Migrationen für Kern-Tabellen plus Onboarding-/Reminder-/Fenster-Einstellungen sowie pinned slots/folder usage.
- Android-Permission- und MediaStore-Service-Grundgerüste.

## Entwicklung

- `npm run check` führt den TypeScript-Check aus.
- `npm run test` baut die Domain-Module und führt Node-basierte Unit-Tests aus.

## Nächste Schritte

- React-Native-Bootstrap (`react-native init`) integrieren.
- Onboarding-Screens auf Basis der neuen Modelle implementieren.
- Queue-Use-Case mit MediaStore-Scan und UI-Session verbinden.
- Sortier-UI (Grid + Einzelbild) und Aktionen (move/copy/delete) implementieren.
