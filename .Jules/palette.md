## 2025-05-14 - [Form and Icon Accessibility]
**Learning:** This app uses several custom UI components that lack basic accessibility markers by default. Specifically, icon-only buttons in chat interfaces and navigation headers needed `aria-label` attributes, and form fields in the intake page were missing `id`/`htmlFor` associations.
**Action:** When adding or modifying interactive elements, always ensure `aria-label` is present for icon-only buttons and that all form inputs have associated labels.
