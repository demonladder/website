import { lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, redirect, Route } from 'react-router-dom';
import ErrorElement from '../components/ErrorElement';
const Mod = lazy(() => import('../pages/mod/Mod'));
import { modLoader as ModLoader } from '../pages/mod/mod.loader';
const ModIndex = lazy(() => import('../pages/mod/ModIndex'));
const Queue = lazy(() => import('../pages/mod/queue/Queue'));
const EditReferences = lazy(() => import('../pages/mod/references/References'));
const SignupLink = lazy(() => import('../pages/mod/signupLinks/SignupLink'));
const AddSubmission = lazy(() => import('../pages/mod/addSubmissions/AddSubmissions'));
const EditSubmission = lazy(() => import('../pages/mod/editSubmissions/EditSubmissions'));
const CreateUser = lazy(() => import('../pages/mod/createUser/CreateUser'));
const AddLevel = lazy(() => import('../pages/mod/addLevel/AddLevel'));
const DeleteUser = lazy(() => import('../pages/mod/deleteUser/DeleteUser'));
const SiteSettings = lazy(() => import('../pages/mod/siteSettings/SiteSettings'));
const Game = lazy(() => import('../pages/root/game/Game'));
import { profileLoader } from '../features/profile/loader';
import Home from '../features/home/HomePage';
const Search = lazy(() => import('../features/search/SearchPage'));
import PlatformerList from '../features/platformerList/PlatformerListPage';
import References from '../pages/root/references/References';
import Packs from '../features/packs/PacksPage';
import About from '../features/about/AboutPage';
import CrossroadPack from '../pages/root/packs/packOverview/CrossroadPack';
import PackOverview from '../features/singlePack/PackOverview';
import Staff from '../pages/StaffPage';
import LevelPage from '../features/level/LevelPage';
import Login from '../features/login/LoginPage';
import SignUp from '../pages/SignupPage';
import Profile from '../features/profile/ProfilePage';
import Notifications from '../pages/NotificationsPage';
import Settings from '../pages/root/settings/Settings';
import AccountSettings from '../pages/root/settings/account/AccountSettings';
import ClientSiteSettings from '../pages/root/settings/siteSettings/SiteSettings';
import DiscordSettings from '../pages/root/settings/profileSettings/DiscordSettings';
import SubmissionSettings from '../pages/root/settings/submissionsSettings/SubmissionSettings';
import Appearance from '../pages/root/settings/appearance/Appearance';
import Developer from '../pages/root/settings/developer/Developer';
import List from '../pages/root/list/List';
import ForgotPassword from '../pages/ForgotPasswordPage';
import Generators from '../pages/root/generators/Generators';
import Alphabet from '../pages/root/generators/alphabet/Alphabet';
import Roulette from '../pages/root/generators/roulette/Roulette';
import ReverseRoulette from '../pages/root/generators/reverseRoulette/ReverseRoulette';
import TierRoulette from '../pages/root/generators/tierRoulette/TierRoulette';
import Decathlon from '../pages/root/generators/decathlon/Decathlon';
import BulkSubmit from '../features/bulkSubmit/BulkSubmit';
import Changelogs from '../features/changelogs/ChangelogsPage';
import FloatingLoadingSpinner from '../components/FloatingLoadingSpinner';
import EditPack from '../pages/mod/pack/EditPack';
import ManageUser from '../pages/mod/manageUser/ManageUser';
import ManageUserContent from '../pages/mod/manageUser/ManageUserContent';
import Verification from '../features/admin/verification/Verification';
import EditLevel from '../pages/mod/editLevel/EditLevel';
import EditTags from '../pages/mod/editTags/EditTags';
import Debugging from '../pages/mod/debugging/Debugging';
import Logs from '../pages/mod/siteLogs/Logs';
import Roles from '../pages/mod/roles/Roles';
import EditRole from '../pages/mod/roles/EditRole';
import MainLayout from '../layouts/MainLayout';

export const router = createBrowserRouter(createRoutesFromElements(
    [
        <Route element={<MainLayout />} errorElement={<ErrorElement />}>
            <Route path='/' element={<Home />} />
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
            <Route path='profile/:userID' element={<Profile />} />
            <Route path='notifications' element={<Notifications />} />
            <Route path='game' element={<Suspense><Game /></Suspense>} />
            <Route path='settings' element={<Settings />}>
                <Route path='account' element={<AccountSettings />} />
                <Route path='site' element={<ClientSiteSettings />} />
                <Route path='profile' element={<DiscordSettings />} />
                <Route path='submission' element={<SubmissionSettings />} />
                <Route path='appearance' element={<Appearance />} />
                <Route path='developer' element={<Developer />} />
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
            <Route path='changeLogs' element={<Changelogs />} />
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
                <Route path='verification' element={<Verification />} />
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
