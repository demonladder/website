import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Root, { rootLoader } from './routes/root/Root';
import Index from './routes/root/RootIndex';
import Ladder, { ladderLoader } from './routes/root/list/Ladder';
import References, { referencesLoader } from './routes/root/references/References';
import LevelOverview, { levelLoader } from './routes/root/level/LevelOverview';
import Login, { loginAction } from './routes/root/login/Login';
import Packs from './routes/root/packs/Packs';
import Profile, { profileLoader } from './routes/root/profile/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    loader: rootLoader,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'list',
        element: <Ladder />,
        loader: ladderLoader,
        children: [
          {
            path: ':creator',
            element: <Ladder />
          }
        ]
      },
      {
        path: 'references',
        element: <References />,
        loader: referencesLoader
      },
      {
        path: 'level/:level_id',
        element: <LevelOverview />,
        loader: levelLoader
      },
      {
        path: 'packs',
        element: <Packs />
      },
      {
        path: 'login',
        element: <Login />,
        action: loginAction
      },
      {
        path: 'profile/:userID',
        element: <Profile />,
        loader: profileLoader
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);