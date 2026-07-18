import { createBrowserRouter, redirect } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import GlobalError from '../components/GlobalError';
import WelcomePage from '../pages/Welcome';
import ProfileSetupPage from '../pages/ProfileSetup';
import CreationPage from '../pages/Creation';
import ReadingPage from '../pages/Reading';
import LibraryPage from '../pages/Library';
import HomePage from '../pages/HomePage';

const getHasSeenOnboarding = () => {
  try {
    return localStorage.getItem('tzipur_has_seen_onboarding') === 'true';
  } catch (error) {
    console.warn("Failed to read from localStorage", error);
    return false;
  }
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <GlobalError />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: () => {
          if (!getHasSeenOnboarding()) {
            return redirect('/welcome');
          }
          return null;
        },
      },
      {
        path: 'welcome',
        element: <WelcomePage />,
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
