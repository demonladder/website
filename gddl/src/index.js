import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './sass/styles.css';
import Root, { rootLoader } from './routes/root/Root';
import Index from './routes/root/RootIndex';
import Ladder, { ladderLoader } from './routes/root/list/Ladder';
import References, { referencesLoader } from './routes/root/references/References';
import LevelOverview, { levelLoader } from './routes/root/level/LevelOverview';
import Login, { loginAction } from './routes/root/login/Login';
import Packs, { packsLoader } from './routes/root/packs/Packs';
import Profile, { profileLoader } from './routes/root/profile/Profile';
import PackOverview, { packLoader } from './routes/root/packs/packOverview/PackOverview';
import Mod, { modLoader } from './routes/mod/Mod';
import { Logout } from './routes/root/login/Logout';
import ErrorElement from './ErrorElement';
import Queue from './routes/mod/queue/Queue';
import ModIndex from './routes/mod/ModIndex';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    loader: rootLoader,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'list',
        element: <Ladder />,
        loader: ladderLoader
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
        element: <Packs />,
        loader: packsLoader
      },
      {
        path: 'pack/:pack_id',
        element: <PackOverview />,
        loader: packLoader
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
  },
  {
    path: '/mod',
    element: <Mod />,
    loader: modLoader,
    children: [
      {
        index: true,
        element: <ModIndex />
      },
      {
        path: 'queue',
        element: <Queue />
      }
    ]
  },
  {
    path: '/logout',
    loader: Logout
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);