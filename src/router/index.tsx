import { createBrowserRouter, redirect } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import GlobalError from '../components/GlobalError';
import { lazy } from 'react';

const WelcomePage = lazy(() => import('../pages/Welcome'));
const ProfileSetupPage = lazy(() => import('../pages/ProfileSetup'));
const CreationPage = lazy(() => import('../pages/Creation'));
const AuthPage = lazy(() => import('../pages/Auth'));
const ReadingPage = lazy(() => import('../pages/Reading'));
const PreviewPage = lazy(() => import('../pages/Preview'));
const LibraryPage = lazy(() => import('../pages/Library'));
const HomePage = lazy(() => import('../pages/HomePage'));

const getHasSeenOnboarding = () => {
  try {
    return localStorage.getItem('has_seen_onboarding') === 'true';
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
        path: 'auth',
        element: <AuthPage />,
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
        path: 'preview/:storyId',
        element: <PreviewPage />,
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
