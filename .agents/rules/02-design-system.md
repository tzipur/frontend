# Design System Rules: Tzipur (ציפור)

## 1. Global Typography
*   **Sizes:** STRICTLY `text-base` for all body text, inputs, buttons, and labels. STRICTLY `text-2xl` for all headings, titles, and story text. No other text sizes are permitted.
*   **Base Text:** Use `font-sans` (Heebo) for all UI elements, buttons, inputs, and metadata.
*   **Story/Reading Text:** Use `font-serif` (Frank Ruhl Libre) for all story titles, headings, and story content.
*   **Niqqud Spacing:** Any text container rendering Hebrew with Niqqud MUST use `leading-loose` or `leading-relaxed` to prevent vowel clipping.

## 2. Tailwind Color Palette (Extend tailwind.config.ts)
*   `tzipur-cream`: `#FDFBF7` (Main background - physical paper feel)
*   `tzipur-brown`: `#4A3F35` (Primary text - softer than black)
*   `tzipur-sky`: `#5B93B5` (Primary brand accent / buttons)
*   `tzipur-sand`: `#F4EBE1` (Secondary background / image placeholders)
*   `tzipur-border`: `#E8DED1` (Subtle lines and dividers)
*   `tzipur-muted`: `#A39B90` (Secondary text / page numbers)
*   `tzipur-error`: `#EF4444` (Error text and destructive actions)
*   `tzipur-error-bg`: `#FEF2F2` (Background for error states)

## 3. Structural & Sizing Tokens
*   **Touch Targets:** All interactive elements (buttons, inputs, chips) MUST have a minimum height of `48px` (Tailwind `h-12` or `py-3`/`py-4`) for mobile accessibility.
*   **Border Radius (The Soft Aesthetic):**
    *   Standard Buttons & Inputs: `rounded-xl` or `rounded-2xl`.
    *   Circular Icon Buttons: `rounded-full`.
    *   **Raised Panels (Reading Screen):** Use an exaggerated `rounded-t-[36px]` to give the text panel a pronounced, friendly curve.
*   **Gaps & Rhythm:** Use `space-y-6` or `space-y-8` for vertical form layouts to keep the UI breathing. Use `gap-3` or `gap-4` for grids.

## 4. Shadows & Elevation (The "Raised Panel" Effect)
To maintain the physical book feel, avoid flat designs. Use these specific shadow layers:
*   **Subtle Elements (Cards/Inputs):** `shadow-sm` or `shadow-md`.
*   **Primary CTA Buttons:** `shadow-md hover:shadow-lg transition-shadow`.
*   **The Raised Reading Panel:** This panel sits at the bottom of the screen and overlaps the image above it. It MUST use the `shadow-raised-panel` utility class for a natural look.
*   **Image Containers:** Use `shadow-inner border border-tzipur-border` to make the illustration placeholders look slightly recessed into the page.

## 5. Global Theming Constraint
*   **Light Mode Only:** Do NOT implement dark mode for this MVP. Force light theme aesthetics globally.