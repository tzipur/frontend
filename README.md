# Tzipur (ציפור)

A Progressive Web App (PWA) designed to help parents turn difficult moments into calming children's stories ("אפליקציה שעוזרת להורים להפוך רגעים קשים לסיפורי ילדים מרגיעים").

## About / אודות (Tech Heal Initiative)

**English:**
Tzipur is proudly developed as part of the **Tech Heal** initiative. It is an AI-powered storytelling companion for parents. When a child experiences a challenging moment, parents can quickly input the situation into Tzipur. The app then generates a personalized, calming, and age-appropriate story tailored to the child's specific profile and current emotional state. These stories are primarily designed to create and strengthen moments of closeness between parents and their children through shared reading, while also helping children process their emotions and find comfort through engaging narratives.

**עברית:**
"ציפור" פותחה בגאווה כחלק מיוזמת **Tech Heal**. זוהי אפליקציה מבוססת בינה מלאכותית המלווה הורים ברגעים מאתגרים. כאשר הילד חווה קושי, ההורים יכולים להזין את המצב בקלות לאפליקציה. "ציפור" מייצרת סיפור מרגיע, מותאם אישית ומונגש גילאית, המבוסס על הפרופיל האישי של הילד ומצבו הרגשי באותו הרגע. הסיפורים נועדו בעיקר לייצר ולחזק רגעי קרבה בין ההורים לילדיהם על ידי הקראה משותפת, ובמקביל לעזור לילדים לעבד את רגשותיהם ולמצוא נחמה דרך נרטיבים מעוררי הזדהות.

## Core Features

- **Intuitive Story Creation**: 
  - **Fast-Track Selection**: Quickly choose from common emotions and scenarios (e.g., Anger, Sadness, Anxiety, Sleep struggles).
  - **Free-Text Input**: Describe highly specific situations for a completely custom narrative tailored to the child's exact experience.
- **Smart Child Profiles**: Parents can set up individual profiles for each child, including their name, age, and personalized configurations. The AI uses this data to ensure the language and themes are perfectly age-appropriate.
- **Story Library & Reader**: All generated stories are saved in a cloud library. The reading interface is deeply optimized for nighttime reading, featuring a distraction-free layout and a dedicated dark mode.
- **True PWA Experience**: Tzipur acts as a native mobile application. It can be installed directly to the home screen on iOS and Android, offering a full-screen, immersive experience without needing an app store download.
- **Premium UI/UX**: Built with modern web design principles, featuring smooth Framer Motion page transitions, a meticulously crafted Dark Mode, and beautiful interactive micro-animations.
- **Native Right-to-Left (RTL)**: Full Hebrew localization by default, powered by `i18next`.

## Tech Stack

- **Frontend Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Routing:** React Router v7
- **Backend API & AI Generation:** Custom Node.js Backend (`https://backend-gfjm.onrender.com`)
- **Database & Authentication:** Supabase (Handles anonymous and permanent user sessions)
- **State Management:** React Query for server state caching and React Context for local app state
- **PWA Integration:** `vite-plugin-pwa`

## Directory Structure

- `src/api/` - Axios clients, React Query mutations, and data-fetching logic.
- `src/components/` - Reusable UI components (Buttons, Modals, Splashes).
- `src/pages/` - Route-level components grouped by feature (Auth, Creation, Library, Reading, Preview).
- `src/hooks/` - Custom React hooks (e.g., `useDarkMode`, `useStorySubscription`).
- `src/locales/` - i18n translation dictionaries.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Tzipur
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

### Scripts
- `npm run dev` - Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build` - Type-checks the project and builds the production bundle (including PWA service workers).
- `npm run preview` - Boots up a local static web server to preview the production build.
- `npm run lint` - Runs Oxlint for extremely fast code quality and linting checks.
