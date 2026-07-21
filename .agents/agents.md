# Tzipur (ציפור) App Index

## Overview
**Tzipur** is a therapeutic app (Progressive Web App) designed to help parents turn difficult moments into calming children's stories ("אפליקציה טיפולית שעוזרת להורים להפוך רגעים קשים לסיפורי ילדים מרגיעים").

## Tech Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4, Framer Motion
- **Routing:** React Router v7
- **Backend & Auth:** Supabase (`@supabase/supabase-js`)
- **i18n:** i18next + react-i18next
- **PWA:** vite-plugin-pwa
- **Icons:** Lucide React
- **Carousel:** Swiper
- **Linting:** Oxlint

## Directory Structure

### `src/`
Core application source code.

- **`components/`**: Reusable UI components.
  - `GlobalError.tsx`
  - `SplashScreen.tsx`
  - `TopBar.tsx`

- **`contexts/`**: React context providers.
  - `AuthContext.tsx`: Supabase authentication context.

- **`hooks/`**: Custom React hooks.
  - `useStorySubscription.ts`: Supabase real-time story subscription.

- **`layouts/`**: Application layout components.
  
- **`lib/`**: Utilities and configurations.
  - `supabase.ts`: Supabase client initialization.
  - `paginateChapterText.ts`: Text pagination utility.
  - `mockData.ts` & `mockStories.json`: Mock data for development.

- **`locales/`**: i18n translation files.
  
- **`pages/`**: Application routes/screens.
  - `Auth/`: Authentication views.
  - `Creation/`: Story creation views.
  - `HomePage/`: Main dashboard.
  - `Library/`: Story library.
  - `Preview/`: Story preview.
  - `ProfileSetup/`: Initial user profile setup.
  - `Reading/`: Story reading interface.
  - `Welcome/`: Onboarding/welcome screen.

- **`router/`**: React Router configurations.
  
- **`types/`**: TypeScript type definitions (`index.ts`).

### Key Configuration Files
- `vite.config.ts`: Vite configuration, including PWA manifest.
- `package.json`: Dependencies and npm scripts (`dev`, `build`, `lint`, `preview`).
- `index.html`: Entry HTML file.
- `vercel.json`: Vercel deployment configuration.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript configurations.
