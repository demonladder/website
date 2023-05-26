import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './sass/styles.css';
import Root from './routes/root/Root';
import Index from './routes/root/RootIndex';
import Ladder from './routes/root/list/Ladder';
import References from './routes/root/references/References';
import LevelOverview from './routes/root/level/LevelOverview';
import Login, { loginAction } from './routes/root/login/Login';
import Packs from './routes/root/packs/Packs';
import Profile from './routes/root/profile/Profile';
import PackOverview from './routes/root/packs/packOverview/PackOverview';
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
        element: <Ladder />
      },
      {
        path: 'references',
        element: <References />
      },
      {
        path: 'level/:levelID',
        element: <LevelOverview />
      },
      {
        path: 'packs',
        element: <Packs />
      },
      {
        path: 'pack/:packID',
        element: <PackOverview />
      },
      {
        path: 'login',
        element: <Login />,
        action: loginAction
      },
      {
        path: 'profile/:userID',
        element: <Profile />
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,  // 10 minutes
      cacheTime: 1000 * 60 * 15,  // 15 minutes
      retry: false,
      keepPreviousData: true,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);