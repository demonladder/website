import React, { lazy } from 'react';
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
const ModIndex = lazy(() => import('./pages/mod/ModIndex'));
const Queue = lazy(() => import('./pages/mod/queue/Queue'));
const EditPacks = lazy(() => import('./pages/mod/packs/EditPacks'));
const EditReferences = lazy(() => import('./pages/mod/references/References'));
const CreatePack = lazy(() => import('./pages/mod/pack/CreatePack'));
const DeleteSubmission = lazy(() => import('./pages/mod/deleteSubmissions/DeleteSubmissions'));
const Promote = lazy(() => import('./pages/mod/promote/Promote'));
const SignupLink = lazy(() => import('./pages/mod/signupLinks/SignupLink'));
const AddSubmission = lazy(() => import('./pages/mod/addSubmissions/AddSubmissions'));
const Add = lazy(() => import('./pages/mod/packs/Add'));
const Remove = lazy(() => import('./pages/mod/packs/Remove'));
const Move = lazy(() => import('./pages/mod/packs/Move'));
const EditSubmission = lazy(() => import('./pages/mod/editSubmissions/EditSubmissions'));
const CreateUser = lazy(() => import('./pages/mod/createUser/CreateUser'));
const AddLevel = lazy(() => import('./pages/mod/addLevel/AddLevel'));
const DeleteUser = lazy(() => import('./pages/mod/deleteUser/DeleteUser'));
const SiteSettings = lazy(() => import('./pages/mod/siteSettings/SiteSettings'));
import ErrorElement from './components/ErrorElement';
import SignUp from './pages/root/signup/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileSettings from './pages/root/settings/profile/ProfileSettings';
import ClientSiteSettings from './pages/root/settings/SiteSettings';
import About from './pages/root/about/About';
import Staff from './pages/root/staff/Staff';
import axios from 'axios';
import APIClient from './api/axios';
import storageManager from './utils/StorageManager';
import UserBans from './pages/mod/userBans/UserBans';
import DeletePack from './pages/mod/pack/DeletePack';
import EditPack from './pages/mod/pack/EditPack';
import Settings from './pages/root/settings/Settings';
import CrossroadPack from './pages/root/packs/packOverview/CrossroadPack';

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
                    path: 'pack/78',
                    element: <CrossroadPack />,
                },
                {
                    path: 'pack/:packID',
                    element: <PackOverview />,
                },
                {
                    path: 'staff',
                    element: <Staff />,
                },
                {
                    path: 'level/:levelID',
                    element: <LevelOverview />,
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
                    children: [
                        {
                            path: 'site',
                            element: <ClientSiteSettings />,
                        },
                        {
                            path: 'profile',
                            element: <ProfileSettings />,
                        },
                    ]
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
                            path: 'deletePack',
                            element: <DeletePack />,
                        },
                        {
                            path: 'editPack',
                            element: <EditPack />,
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
                            path: 'userBans',
                            element: <UserBans />,
                        },
                        {
                            path: 'signupLinks',
                            element: <SignupLink />,
                        },
                        {
                            path: 'addLevel',
                            element: <AddLevel />,
                        },
                        {
                            path: 'siteSettings',
                            element: <SiteSettings />,
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

window.onload = () => {
    const fragment = new URLSearchParams(window.location.hash.replace('#', ''));
    const [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')];

    if (!accessToken || !tokenType) return;

    axios.get('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `${tokenType} ${accessToken}`,
        },
    }).then((response) => {
        const csrfToken = storageManager.getCSRF();

        APIClient.post('/discord/connect', response.data, {
            withCredentials: true,
            params: { csrfToken },
        }).then(() => location.replace('/')).catch((err) => {
            if (err) return;
        });
    }).catch((err) => {
        if (err) return;
    });
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