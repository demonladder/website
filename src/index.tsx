/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.scss';
import ms from 'ms';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import Root from './pages/root/Root';
import Index from './pages/root/RootIndex';
import Search from './pages/root/search/Search';
import References from './pages/root/references/References';
import LevelOverview from './pages/root/level/LevelOverview';
import Login from './pages/root/login/Login';
import Packs from './pages/root/packs/Packs';
import Profile, { profileLoader } from './pages/root/profile/Profile';
import PackOverview from './pages/root/packs/packOverview/PackOverview';
import Mod from './pages/mod/Mod';
import { modLoader as ModLoader } from './pages/mod/Mod';
const ModIndex = lazy(() => import('./pages/mod/ModIndex'));
const Queue = lazy(() => import('./pages/mod/queue/Queue'));
const EditReferences = lazy(() => import('./pages/mod/references/References'));
const SignupLink = lazy(() => import('./pages/mod/signupLinks/SignupLink'));
const AddSubmission = lazy(() => import('./pages/mod/addSubmissions/AddSubmissions'));
const EditSubmission = lazy(() => import('./pages/mod/editSubmissions/EditSubmissions'));
const CreateUser = lazy(() => import('./pages/mod/createUser/CreateUser'));
const AddLevel = lazy(() => import('./pages/mod/addLevel/AddLevel'));
const DeleteUser = lazy(() => import('./pages/mod/deleteUser/DeleteUser'));
const SiteSettings = lazy(() => import('./pages/mod/siteSettings/SiteSettings'));
import ErrorElement from './components/ErrorElement';
import SignUp from './pages/root/signup/SignUp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfileSettings from './pages/root/settings/profileSettings/ProfileSettings';
import ClientSiteSettings from './pages/root/settings/siteSettings/SiteSettings';
import About from './pages/root/about/About';
import Staff from './pages/root/staff/Staff';
import axios from 'axios';
import APIClient from './api/APIClient';
import UserBans from './pages/mod/userBans/UserBans';
import EditPack from './pages/mod/pack/EditPack';
import Settings from './pages/root/settings/Settings';
import CrossroadPack from './pages/root/packs/packOverview/CrossroadPack';
import EditTags from './pages/mod/editTags/EditTags';
import SubmissionSettings from './pages/root/settings/submissionsSettings/SubmissionSettings';
import Notifications from './pages/root/notifications/Notifications';
import { sessionLoader } from './utils/sessionLoader';
import StorageManager from './utils/StorageManager';
import Debugging from './pages/mod/debugging/Debugging';
import PlatformerList from './pages/root/platformerList/PlatformerList';
import MenuContextProvider from './components/ui/menuContext/MenuContextContainer';
import Logs from './pages/mod/siteLogs/Logs';
const Game = lazy(() => import('./pages/root/game/Game'));
import List from './pages/root/list/List';
import EditLevel from './pages/mod/editLevel/EditLevel';
import { HelmetProvider } from 'react-helmet-async';
import ModalProvider from './context/ModalProvider';
import Roles from './pages/mod/roles/Roles';
import EditRole from './pages/mod/roles/EditRole';
import ForgotPassword from './pages/root/forgotPassword/ForgotPassword';
import Generators from './pages/root/generators/Generators';
import Alphabet from './pages/root/generators/alphabet/Alphabet';
import Roulette from './pages/root/generators/roulette/Roulette';
import BulkSubmit from './pages/root/bulkSubmit/BulkSubmit';
import NavbarNotificationProvider from './context/NavbarNotification/NavbarNotificationProvider';

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
                    path: 'search',
                    element: <Search />,
                },
                {
                    path: 'platformerList',
                    element: <PlatformerList />,
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
                    path: 'profile',
                    loader: profileLoader,
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
                    path: 'notifications',
                    loader: sessionLoader,
                    element: <Notifications />,
                },
                {
                    path: 'game',
                    element: <Suspense><Game /></Suspense>,
                },
                {
                    path: 'settings',
                    //loader: sessionLoader,
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
                        {
                            path: 'submission',
                            element: <SubmissionSettings />,
                        },
                    ],
                },
                {
                    path: 'list',
                    loader: () => redirect('/search'),
                },
                {
                    path: 'list/:listID',
                    element: <List />,
                },
                {
                    path: 'forgotPassword',
                    element: <ForgotPassword />,
                },
                {
                    path: 'generators',
                    element: <Generators />,
                    children: [
                        {
                            path: 'alphabet',
                            element: <Alphabet />,
                        },
                        {
                            path: 'roulette',
                            element: <Roulette />,
                        },
                    ],
                },
                {
                    path: 'bulkSubmit',
                    element: <BulkSubmit />,
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
                            path: 'references',
                            element: <EditReferences />
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
                            path: 'editLevel',
                            element: <EditLevel />,
                        },
                        {
                            path: 'editTags',
                            element: <EditTags />
                        },
                        {
                            path: 'siteSettings',
                            element: <SiteSettings />,
                        },
                        {
                            path: 'debugging',
                            element: <Debugging />,
                        },
                        {
                            path: 'logs',
                            element: <Logs />,
                        },
                        {
                            path: 'roles',
                            element: <Roles />,
                        },
                        {
                            path: 'roles/:roleID',
                            element: <EditRole />,
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
            staleTime: ms('2h'),
            cacheTime: ms('2h') + ms('5m'),
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
        APIClient.post('/discord/connect', response.data).then(() => location.replace('/')).catch((err) => {
            if (err) return;
        });
    }).catch((err) => {
        if (err) return;
    });
}

const rootElement = document.getElementById('root') || createRoot();
const root = ReactDOM.createRoot(rootElement);
StorageManager.getIsRounded() && rootElement.classList.add('round');
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <HelmetProvider>
                <MenuContextProvider>
                    <ModalProvider>
                        <NavbarNotificationProvider>
                            <RouterProvider router={router} />
                            <ReactQueryDevtools initialIsOpen={false} />
                        </NavbarNotificationProvider>
                    </ModalProvider>
                </MenuContextProvider>
            </HelmetProvider>
        </QueryClientProvider>
        <ToastContainer theme='dark' position='bottom-right' />
    </React.StrictMode>
);