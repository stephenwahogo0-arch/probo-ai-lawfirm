## 2025-05-14 - Auto-scroll Pattern for Chat Interfaces
**Learning:** Implementing auto-scroll using a hidden bottom-anchored 'div' with 'useRef' and a 'useEffect' hook triggered by 'messages' or 'loading' state changes is a reusable UX pattern for this design system's chat components. It ensures that the latest interactions and system feedback (like loading states) are immediately visible to the user.
**Action:** Always include auto-scroll logic in new chat-like interfaces and ensure existing ones are updated to trigger on both new messages and loading state changes.
