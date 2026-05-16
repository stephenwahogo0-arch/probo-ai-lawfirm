## 2026-05-16 - [Initial Audit]
**Learning:** The application uses many icon-only buttons and inputs without explicit label associations, which hinders screen reader accessibility. The "Probo" theme uses a futuristic "Vortex" aesthetic but lacks some basic UX affordances like auto-scrolling in all chat interfaces.
**Action:** Always ensure icon-only buttons have `aria-label` and inputs have associated `label` elements with `htmlFor`.
