import { createBrowserRouter, redirect } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import WelcomePage from '../pages/Welcome';
import ProfileSetupPage from '../pages/ProfileSetup';
import CreationPage from '../pages/Creation';
import ReadingPage from '../pages/Reading';
import LibraryPage from '../pages/Library';
import OnboardingScreen from '../pages/OnboardingScreen';

const hasSeenOnboarding = localStorage.getItem('tzipur_has_seen_onboarding') === 'true';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'onboarding',
        element: <OnboardingScreen />,
      },
      {
        index: true,
        element: <WelcomePage />,
        loader: () => {
          if (!hasSeenOnboarding) {
            return redirect('/onboarding');
          }
          return null;
        },
      },
      {
        path: 'profile',
        element: <ProfileSetupPage />,
      },
      {
        path: 'create',
        element: <CreationPage />,
      },
      {
        path: 'read/:storyId',
        element: <ReadingPage />,
      },
      {
        path: 'library',
        element: <LibraryPage />,
      },
    ],
  },
]);
