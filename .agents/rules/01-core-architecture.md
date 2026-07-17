# Project Architecture: Tzipur (ציפור)

## 1. Tech Stack
*   **Framework:** React Single Page Application (SPA) via Vite.
*   **Language:** TypeScript (Strict mode enabled).
*   **Styling:** Tailwind CSS.
*   **Data Fetching & State:** TanStack Query v5.
*   **Backend & Auth:** Supabase (PostgreSQL, Row Level Security).
*   **Routing:** React Router.

## 2. Global Constraints
*   **RTL First:** The application is entirely in Hebrew. The `<body>` and root `#root` wrapper MUST include `dir="rtl"`.
*   **No Latency UX:** Eliminate traditional loading spinners where possible. Favor optimistic UI updates and use Lottie animations to mask AI generation times.

## 3. Data & State Management
*   **Server State:** Managed exclusively via TanStack Query v5 interacting with the Supabase JS client.
*   **Guest-to-Registered Handoff:** 
    *   If a guest user generates and reads a story, hold the story object in `sessionStorage` (or initialize a local TanStack Query cache entry). 
    *   If they click "Save to Library" at the end of the story, redirect to the Supabase Auth flow. 
    *   Immediately upon successful Auth resolution, check `sessionStorage`. If a pending story exists, automatically execute a Supabase mutation to insert it into their new "Family Library", then clear the session storage.

## 4. Frontend Pagination Logic (Reading Screen)
The backend treats a story as a collection of "Chapters" (large strings of text), but the frontend must strictly control the pagination to account for responsive screen sizes and Hebrew Niqqud vertical spacing.
*   **The Heuristic:** Create a pure TypeScript utility function: `paginateChapterText(content: string, maxChars: number = 120): string[]`.
*   **The Rules:** 
    *   Do NOT cut words in half.
    *   Split the string into an array of smaller page strings.
    *   Attempt to break pages at natural sentence boundaries (periods, commas, question marks).
    *   Each returned string in the array represents one physical "page" in the Reading Screen carousel.

## 5. User Flow Definitions
*   **Welcome / Onboarding:** Determine user status immediately upon app load.
*   **Setup / Settings Console:** Use a single, shared React component for both Registration and Settings. 
    *   If `user` exists in the Supabase session, populate the form values and label the CTA "Save Changes". 
    *   If no session, leave blank and label the CTA "Continue as Guest".
*   **Story Generation (MVP):** Do NOT stream text chunks from the backend. When the user clicks "Create Story", immediately mount the `<LoaderScreen/>` containing a 3-5 second calming Lottie animation, fire the generation API call, and then reveal the statically generated Preview text.