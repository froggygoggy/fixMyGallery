# Fix my Gallery

Fix my Gallery ist eine Android-App auf Basis von React Native, die Nutzer:innen beim Aufräumen ihrer Foto- und Videoordner unterstützt.

## Aktueller Stand

Dieses Repository enthält ein umsetzbares Domain-Fundament für Sprint 1/2:

- Projektstruktur für App-, Domain-, Data- und Platform-Layer.
- Domain-Typen, Modelle und Service-Schnittstellen.
- Queue-Engine für `old`/`new` inklusive 30-Tage-Logik für neue Fotos.
- Zielfortschritts-Service für Zeit-/Anzahl-Pensum.
- Reminder-Entscheidungsservice für "nur benachrichtigen, wenn Aufgaben offen sind".
- Use Case zum Bauen einer Session-Queue aus Repository-Daten.
- In-Memory-Repository für schnelle Entwicklung und Tests von Domainlogik.
- SQLite-Migrationen für Kern-Tabellen plus Onboarding-/Reminder-/Fenster-Einstellungen.
- Android-Permission- und MediaStore-Service-Grundgerüste.

## Nächste Schritte

- React-Native-Bootstrap (`react-native init`) integrieren.
- Onboarding-Screens auf Basis der neuen Modelle implementieren.
- Queue-Use-Case mit MediaStore-Scan und UI-Session verbinden.
- Sortier-UI (Grid + Einzelbild) und Aktionen (move/copy/delete) implementieren.
