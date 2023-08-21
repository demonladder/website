import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './pages/root/Root';
import Index from './pages/root/RootIndex';
import Ladder from './pages/root/list/Ladder';
import References from './pages/root/references/References';
import LevelOverview from './pages/root/level/LevelOverview';
import Login from './pages/root/login/Login';
import Packs from './pages/root/packs/Packs';
import Profile from './pages/root/profile/Profile';
import PackOverview from './pages/root/packs/packOverview/PackOverview';
import Mod from './pages/mod/Mod';
import { modLoader as ModLoader } from './pages/mod/Mod';
import ModIndex from './pages/mod/ModIndex';
import Queue from './pages/mod/queue/Queue';
import EditPacks from './pages/mod/packs/EditPacks';
import EditReferences from './pages/mod/references/References';
import CreatePack from './pages/mod/pack/CreatePack';
import DeleteSubmission from './pages/mod/deleteSubmissions/DeleteSubmissions';
import Promote from './pages/mod/promote/Promote';
import SignupLink from './pages/mod/signupLinks/SignupLink';
import ErrorElement from './components/ErrorElement';
import SignUp from './pages/root/signup/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddSubmission from './pages/mod/addSubmissions/AddSubmissions';
import ProfileSettings from './pages/root/profile/settings/Settings';
import Add from './pages/mod/packs/Add';
import Remove from './pages/mod/packs/Remove';
import Move from './pages/mod/packs/Move';
import EditSubmission from './pages/mod/editSubmissions/EditSubmissions';
import CreateUser from './pages/mod/createUser/CreateUser';
import Settings from './pages/root/settings/Settings';
import AddLevel from './pages/mod/addLevel/AddLevel';
import About from './pages/root/about/About';
import DeleteUser from './pages/mod/deleteUser/DeleteUser';

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Root />,
            errorElement: <ErrorElement />,
            children: [
                {
                    index: true,
                    element: <Index />,
                },
                {
                    path: 'list',
                    element: <Ladder />,
                },
                {
                    path: 'references',
                    element: <References />,
                },
                {
                    path: 'packs',
                    element: <Packs />,
                },
                {
                    path: 'about',
                    element: <About />,
                },
                {
                    path: 'level/:levelID',
                    element: <LevelOverview />,
                },
                {
                    path: 'pack/:packID',
                    element: <PackOverview />,
                },
                {
                    path: 'login',
                    element: <Login />,
                },
                {
                    path: 'signup',
                    element: <SignUp />,
                },
                {
                    path: 'profile/settings',
                    element: <ProfileSettings />,
                },
                {
                    path: 'profile/:userID',
                    element: <Profile />,
                },
                {
                    path: 'settings',
                    element: <Settings />,
                },
                {
                    path: '/mod',
                    element: <Mod />,
                    loader: ModLoader,
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
                            element: <EditPacks />,
                            children: [
                                {
                                    path: 'add',
                                    element: <Add />,
                                },
                                {
                                    path: 'remove',
                                    element: <Remove />,
                                },
                                {
                                    path: 'move',
                                    element: <Move />,
                                },
                            ]
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
                            path: 'addSubmission',
                            element: <AddSubmission />,
                        },
                        {
                            path: 'editSubmission',
                            element: <EditSubmission />,
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
                            path: 'createUser',
                            element: <CreateUser />,
                        },
                        {
                            path: 'deleteUser',
                            element: <DeleteUser />,
                        },
                        {
                            path: 'signupLinks',
                            element: <SignupLink />,
                        },
                        {
                            path: 'addLevel',
                            element: <AddLevel />,
                        },
                    ]
                },
            ],
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
        <ToastContainer theme='dark' position='bottom-right' />
    </React.StrictMode>
);