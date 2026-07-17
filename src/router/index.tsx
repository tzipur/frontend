import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import WelcomePage from '../pages/Welcome';
import ProfileSetupPage from '../pages/ProfileSetup';
import CreationPage from '../pages/Creation';
import ReadingPage from '../pages/Reading';
import LibraryPage from '../pages/Library';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
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
