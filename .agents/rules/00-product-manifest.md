# Product Manifest & UX Rules: Tzipur (ציפור)

## The Mission
Tzipur is a therapeutic PWA designed for parents experiencing PTSD. The app helps them re-frame stressful daily encounters (e.g., losing patience, sensory overload) into engaging, calming children's stories. The goal is to bridge emotional gaps and rebuild trust through shared reading. 

## UX Core Principles
*   **Empathy & Calm:** The UI must never cause cognitive overload. Keep text verbose, explanatory, and deeply empathetic. 
*   **Mobile-First:** THIS IS A MOBILE APP. All layouts must be designed for phone screens. Use Tailwind constraints like `max-w-md mx-auto`, `w-full`, and `min-h-[100dvh]` to mimic a native mobile viewport. 
*   **Right-to-Left (RTL) Logic:** The app is entirely in Hebrew (`dir="rtl"`). 
    *   All padding, margins, and flex directions must respect RTL (e.g., `ml-` becomes `ms-`, `pr-` becomes `pe-`).
    *   **Crucial Pagination Logic:** In RTL, you read from right to left. Therefore, the "Next Page" arrow points LEFT (‹), and the "Previous Page" arrow points RIGHT (›).

## Business Logic (Mock State MVP)
*   **Zero Backend:** The frontend currently operates in a 100% mock state. Do not attempt to wire up actual Supabase mutations yet.
*   **Profile Logic:** Parents register their own Nickname, and can add multiple Children. Each Child object optionally includes: Nickname, Age, Hobby, and Favorite Animal.
*   **Input Logic:** The user must explicitly choose their input method: "Speak" (prominent, centered microphone) OR "Write" (text area).