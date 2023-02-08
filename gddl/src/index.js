import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Root from './routes/root/Root';
import Index from './routes/root/RootIndex';
import Ladder, { ladderLoader } from './routes/root/list/Ladder';
import References, { referencesLoader } from './routes/root/references/References';
import LevelOverview, { levelLoader } from './routes/level/LevelOverview';
import Login, { loginAction } from './routes/root/login/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'list',
        element: <Ladder />,
        loader: ladderLoader,
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
        path: 'login',
        element: <Login />,
        action: loginAction
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