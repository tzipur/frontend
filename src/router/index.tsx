import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import WelcomePage from '../pages/WelcomePage';
import ProfileSetupPage from '../pages/ProfileSetupPage';
import CreationPage from '../pages/CreationPage';
import ReadingPage from '../pages/ReadingPage';
import LibraryPage from '../pages/LibraryPage';

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
