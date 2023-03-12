import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './sass/styles.css';
import Root from './routes/root/Root';
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
import Utils from './routes/utils/Utils'
import EditPacks from './routes/mod/packs/EditPacks';
import EditReferences from './routes/mod/references/References';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
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
      },
      {
        path: 'utils',
        element: <Utils />
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
      },
      {
        path: 'packs',
        element: <EditPacks />
      },
      {
        path: 'references',
        element: <EditReferences />
      }
    ]
  },
  {
    path: '/logout',
    loader: Logout
  }
]);

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 } } });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);