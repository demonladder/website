/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.scss';
import ms from 'ms';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createBrowserRouter, createRoutesFromElements, redirect, Route, RouterProvider } from 'react-router-dom';
import Root from './pages/root/Root';
import Index from './pages/root/RootIndex';
import Search from './pages/root/search/Search';
import References from './pages/root/references/References';
import LevelPage from './pages/root/level/LevelPage';
import Login from './pages/root/login/Login';
import Packs from './pages/root/packs/Packs';
import Profile from './pages/root/profile/Profile';
import { profileLoader } from './pages/root/profile/profileLoader';
import PackOverview from './pages/root/packs/packOverview/PackOverview';
const Mod = lazy(() => import('./pages/mod/Mod'));
import { modLoader as ModLoader } from './pages/mod/mod.loader';
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
import DiscordSettings from './pages/root/settings/profileSettings/DiscordSettings';
import ClientSiteSettings from './pages/root/settings/siteSettings/SiteSettings';
import About from './pages/root/about/About';
import Staff from './pages/root/staff/Staff';
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
import TierRoulette from './pages/root/generators/tierRoulette/TierRoulette';
import ChangeLogs from './pages/root/changeLogs/ChangeLogs';
import ReverseRoulette from './pages/root/generators/reverseRoulette/ReverseRoulette';
import Decathlon from './pages/root/generators/decathlon/Decathlon';
import ManageUser from './pages/mod/manageUser/ManageUser';
import ManageUserContent from './pages/mod/manageUser/ManageUserContent';
import FloatingLoadingSpinner from './components/FloatingLoadingSpinner';

const router = createBrowserRouter(createRoutesFromElements(
    [
        <Route path='/' element={<Root />} errorElement={<ErrorElement />}>
            <Route index element={<Index />} />
            <Route path='search' element={<Search />} />
            <Route path='platformerList' element={<PlatformerList />} />
            <Route path='references' element={<References />} />
            <Route path='packs' element={<Packs />} />
            <Route path='about' element={<About />} />
            <Route path='pack/78' element={<CrossroadPack />} />
            <Route path='pack/:packID' element={<PackOverview />} />
            <Route path='staff' element={<Staff />} />
            <Route path='level/:levelID' element={<LevelPage />} />
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='profile' loader={profileLoader} />
            <Route path='profile/settings' element={<DiscordSettings />} />
            <Route path='profile/:userID' element={<Profile />} />
            <Route path='notifications' element={<Notifications />} loader={sessionLoader} />
            <Route path='game' element={<Suspense><Game /></Suspense>} />
            <Route path='settings' element={<Settings />}>
                <Route path='site' element={<ClientSiteSettings />} />
                <Route path='profile' element={<DiscordSettings />} />
                <Route path='submission' element={<SubmissionSettings />} />
            </Route>
            <Route path='list' loader={() => redirect('/search')} element={<p>hi</p>} />
            <Route path='list/:listID' element={<List />} />
            <Route path='forgotPassword' element={<ForgotPassword />} />
            <Route path='generators' element={<Generators />}>
                <Route path='alphabet' element={<Alphabet />} />
                <Route path='roulette' element={<Roulette />} />
                <Route path='reverseRoulette' element={<ReverseRoulette />} />
                <Route path='tierRoulette' element={<TierRoulette />} />
                <Route path='decathlon' element={<Decathlon />} />
            </Route>
            <Route path='bulkSubmit' element={<BulkSubmit />} />
            <Route path='changeLogs' element={<ChangeLogs />} />
            <Route path='mod' element={<Suspense fallback={<FloatingLoadingSpinner />} ><Mod /></Suspense>} loader={ModLoader}>
                <Route index element={<ModIndex />} />
                <Route path='queue' element={<Queue />} />
                <Route path='references' element={<EditReferences />} />
                <Route path='editPack' element={<EditPack />} />
                <Route path='addSubmission' element={<AddSubmission />} />
                <Route path='editSubmission' element={<EditSubmission />} />
                <Route path='manageUser' element={<ManageUser />}>
                    <Route path=':userID' element={<ManageUserContent />} />
                </Route>
                <Route path='createUser' element={<CreateUser />} />
                <Route path='deleteUser' element={<DeleteUser />} />
                <Route path='signupLinks' element={<SignupLink />} />
                <Route path='addLevel' element={<AddLevel />} />
                <Route path='editLevel' element={<EditLevel />} />
                <Route path='editTags' element={<EditTags />} />
                <Route path='siteSettings' element={<SiteSettings />} />
                <Route path='debugging' element={<Debugging />} />
                <Route path='logs' element={<Logs />} />
                <Route path='roles' element={<Roles />} />
                <Route path='roles/:roleID' element={<EditRole />} />
            </Route>
        </Route>,
    ],
));

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

const rootElement = document.getElementById('root') ?? createRoot();
const root = ReactDOM.createRoot(rootElement);
if (StorageManager.getIsRounded()) rootElement.classList.add('round');
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