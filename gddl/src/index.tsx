import React, { Suspense, lazy } from 'react';
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
const EditReferences = lazy(() => import('./pages/mod/references/References'));
const DeleteSubmission = lazy(() => import('./pages/mod/deleteSubmissions/DeleteSubmissions'));
const Promote = lazy(() => import('./pages/mod/promote/Promote'));
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
import ProfileSettings from './pages/root/settings/profile/ProfileSettings';
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
import SubmissionSettings from './pages/root/settings/submissions/SubmissionSettings';
import Notifications from './pages/root/notifications/Notifications';
import { sessionLoader } from './utils/sessionLoader';
import StorageManager from './utils/StorageManager';
const Game = lazy(() => import('./pages/root/game/Game'));

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
                    element: <Settings />,
                    children: [
                        {
                            path: 'site',
                            element: <ClientSiteSettings />,
                        },
                        {
                            path: 'profile',
                            loader: sessionLoader,
                            element: <ProfileSettings />,
                        },
                        {
                            path: 'submission',
                            loader: sessionLoader,
                            element: <SubmissionSettings />,
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
                            path: 'editTags',
                            element: <EditTags />
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
        APIClient.post('/discord/connect', response.data).then(() => location.replace('/')).catch((err) => {
            if (err) return;
        });
    }).catch((err) => {
        if (err) return;
    });
}

// Close context menu if the user clicks anywhere not on it
function closeContext(e: MouseEvent) {
    const menu = document.getElementById('profileSubmissionContext');
    if (menu === null) return;

    if ((e.target as HTMLDivElement).offsetParent != menu) {
        menu.classList.remove('visible');
        e.preventDefault();
    }
}
function closeContextScroll() {
    const menu = document.getElementById('profileSubmissionContext');
    if (menu === null) return;

    menu.classList.remove('visible');
}
document.addEventListener('click', closeContext);
document.addEventListener('scroll', closeContextScroll);

const rootElement = document.getElementById('root') || createRoot();
const root = ReactDOM.createRoot(rootElement);
StorageManager.getIsRounded() && rootElement.classList.add('round');
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <ToastContainer theme='dark' position='bottom-right' />
		<div id='profileSubmissionContext' className='fixed w-36 z-50 hidden bg-gray-900 text-white round:rounded shadow-2xl cursor-pointer'>
			<div className='my-1 px-2 py-1 hover:bg-gray-700'>Info</div>
			<div className='my-1 px-2 py-1 hover:bg-red-600'>Delete</div>
		</div>
    </React.StrictMode>
);