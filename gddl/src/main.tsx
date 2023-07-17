import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/root/Root';
import Index from './routes/root/RootIndex';
import Ladder from './routes/root/list/Ladder';
import References from './routes/root/references/References';
import LevelOverview from './routes/root/level/LevelOverview';
import Login from './routes/root/login/Login';
import Packs from './routes/root/packs/Packs';
import Profile from './routes/root/profile/Profile';
import PackOverview from './routes/root/packs/packOverview/PackOverview';
import Mod from './routes/mod/Mod';
import ModIndex from './routes/mod/ModIndex';
import Queue from './routes/mod/queue/Queue';
import EditPacks from './routes/mod/packs/EditPacks';
import EditReferences from './routes/mod/references/References';
import CreatePack from './routes/mod/pack/CreatePack';
import DeleteSubmission from './routes/mod/deleteSubmissions/DeleteSubmissions';
import Promote from './routes/mod/promote/Promote';
import SignupLink from './routes/mod/signupLinks/SignupLink';
import ErrorElement from './ErrorElement';
import SignUp from './routes/root/signup/SignUp';

const router = createBrowserRouter(
  [
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
          action: Login.loginAction,
        },
        {
          path: 'signup',
          element: <SignUp />,
        },
        {
          path: 'profile/:userID',
          element: <Profile />,
        },
      ],
    },
    {
      path: '/mod',
      element: <Mod />,
      loader: Mod.modLoader,
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
        },
        {
          path: 'createPack',
          element: <CreatePack />,
        },
        {
          path: 'deleteSubmission',
          element: <DeleteSubmission />,
        },
        {
          path: 'promote',
          element: <Promote />,
        },
        {
          path: 'signupLinks',
          element: <SignupLink />,
        },
      ]
    },
  ],
);

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

function createRoot() {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
  return root;
}

const rootElement = document.getElementById('root') || createRoot();
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);