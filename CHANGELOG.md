# Changelog

## 1.3.4 — 2026-11-27

- Fixed vertical shaking after jumping to a message while a custom text size was active. Zooming the chat column mixed visual coordinates with Telegram's scroll coordinates, causing repeated position corrections.
- Replaced chat column zoom with Telegram's native message font size variables in Web A and Web K. Message text scales without changing the scroll coordinate system.
- Preserved independent sidebar sizing and kept spoiler canvas scaling aligned with the unzoomed chat.
- Avoided redundant style and sidebar zoom updates.
- Added browser regression coverage for scroll stability, text scaling, native size changes, and sidebar inclusion at 50–200%.

