import { lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, redirect, Route } from 'react-router';
import ErrorElement from '../components/ErrorElement';
import { modLoader as ModLoader } from '../features/admin/mod.loader';
const ModIndex = lazy(() => import('../features/admin/index/index.page'));
const Queue = lazy(() => import('../features/admin/queue/Queue'));
const Beta = lazy(() => import('../features/admin/beta/BetaAccess'));
const EditReferences = lazy(() => import('../features/admin/references/References'));
const SignupLink = lazy(() => import('../features/admin/signupLinks/SignupLink'));
const AddSubmission = lazy(() => import('../features/admin/addSubmissions/AddSubmissions'));
const EditSubmission = lazy(() => import('../features/admin/edit-submission/EditSubmissions'));
const CreateUser = lazy(() => import('../features/admin/createUser/CreateUser'));
const AddLevel = lazy(() => import('../features/admin/addLevel/AddLevel'));
const DeleteUser = lazy(() => import('../features/admin/deleteUser/DeleteUser'));
const SiteSettings = lazy(() => import('../features/admin/site-settings/SiteSettings'));
import Game from '../features/game/Game';
import { profileLoader } from '../features/profile/loader';
import Home from '../features/home/HomePage';
const Search = lazy(() => import('../features/search/SearchPage'));
const PlatformerList = lazy(() => import('../features/platformerList/PlatformerListPage'));
const References = lazy(() => import('../features/references/References'));
const Packs = lazy(() => import('../features/packs/PacksPage'));
import About from '../features/about/AboutPage';
import CrossroadPack from '../features/crossroadPack/CrossroadPack';
const PackOverview = lazy(() => import('../features/singlePack/PackOverview'));
import Staff from '../features/staff/staff.page';
import LevelPage from '../features/level/LevelPage';
import Login from '../features/login/LoginPage';
import SignUp from '../features/signup/signup.page';
const Profile = lazy(() => import('../features/profile/ProfilePage'));
import Notifications from '../features/notifications/notifications.page';
import Settings from '../features/settings/Settings';
import AccountSettings from '../features/settings/account/Account';
import ClientSiteSettings from '../features/settings/site/Site';
import ProfileSettings from '../features/settings/profile/Profile';
import SubmissionSettings from '../features/settings/submissions/SubmissionSettings';
import Appearance from '../features/settings/appearance/Appearance';
import Developer from '../features/settings/developer/Developer';
const List = lazy(() => import('../features/list/ListPage'));
import ForgotPassword from '../features/forgot-password/forgot-password.page';
const Generators = lazy(() => import('../features/generators/Generators'));
const Alphabet = lazy(() => import('../features/generators/alphabet/Alphabet'));
const Roulette = lazy(() => import('../features/generators/roulette/Roulette'));
const ReverseRoulette = lazy(() => import('../features/generators/reverseRoulette/ReverseRoulette'));
const TierRoulette = lazy(() => import('../features/generators/tierRoulette/TierRoulette'));
const Decathlon = lazy(() => import('../features/generators/decathlon/Decathlon'));
import BulkSubmit from '../features/bulkSubmit/BulkSubmit';
import Changelogs from '../features/changelogs/ChangelogsPage';
import FloatingLoadingSpinner from '../components/ui/FloatingLoadingSpinner';
import EditPack from '../features/admin/edit-pack/edit-pack.page';
import ManageUser from '../features/admin/manage-user/manage-user.page';
import ManageUserContent from '../features/admin/manage-user/components/ManageUserContent';
import Verification from '../features/admin/verification/Verification';
import EditLevel from '../features/admin/editLevel/EditLevel';
import EditTags from '../features/admin/editTags/EditTags';
import Debugging from '../features/admin/debugging/debugging.page';
import Roles from '../features/admin/roles/Roles';
import EditRole from '../features/admin/roles/EditRole';
import MainLayout from '../layouts/MainLayout';
import SubmissionMerge from '../features/admin/submissionMerging/SubmissionMerge';
import AdminLayout from '../features/admin/AdminLayout';
import AuditLogs from '../features/admin/audit-logs/AuditLogs';
import FavoriteLevels from '../features/profile/components/LevelPreferences';
import Rankings from '../features/profile/components/Rankings';
import { listLoader } from '../features/list/list.loader';
import { QueryClient } from '@tanstack/react-query';
import { levelLoader } from '../features/level/level.loader';
import { searchLoader } from '../features/search/search.loader';
import OAuth2Layout from '../layouts/oauth2/OAuth2';
import Authorize from '../features/oauth2/authorize/authorize.page';
import { AuthorizeLoader } from '../features/oauth2/authorize/authorize.loader';
import Invalid from '../features/oauth2/invalid/invalid.page';
import Applications from '../features/applications/applications.page';
import Application from '../features/applications/application/application.page';
import { applicationLoader } from '../features/applications/application/application.loader';
import TOTPPage from '../features/totp/totp.page';
import TOTPRegisterPage from '../features/totp/totp-register.page';
import { totpRegisterLoader } from '../features/totp/totp-register.loader';
import SubmitPage from '../features/submit/submit.page';
import { routes } from './route-definitions';
import { submitLoader } from '../features/submit/submit.loader';
import SubmissionSearch from '../features/admin/submission-search/submission-search.page';

export const router = (queryClient: QueryClient) => createBrowserRouter(createRoutesFromElements(
    [
        <Route element={<OAuth2Layout />} path='/oauth2'>
            <Route element={<Authorize />} path='authorize' loader={AuthorizeLoader} />
            <Route element={<Invalid />} path='invalid' />
        </Route>,
        <Route element={<MainLayout />} errorElement={<ErrorElement />}>
            <Route path='/' element={<Home />} />
            <Route path='developer/applications' element={<Applications />} />
            <Route path='developer/applications/:appID' element={<Application />} loader={applicationLoader(queryClient)} />
            <Route path='search' element={<Search />} loader={searchLoader} />
            <Route path={routes.submit.path} element={<SubmitPage />} />
            <Route path={routes.submit.level.path} element={<SubmitPage />} loader={submitLoader(queryClient)} />
            <Route path='platformerList' element={<PlatformerList />} />
            <Route path='references' element={<References />} />
            <Route path='packs' element={<Packs />} />
            <Route path='about' element={<About />} />
            <Route path='pack/78' element={<CrossroadPack />} />
            <Route path='pack/:packID' element={<PackOverview />} />
            <Route path='staff' element={<Staff />} />
            <Route path='auth/totp/authenticate' element={<TOTPPage />} />
            <Route path='auth/totp/register' element={<TOTPRegisterPage />} loader={totpRegisterLoader} />
            <Route path='level/:levelID' element={<LevelPage />} loader={levelLoader(queryClient)} />
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='profile' loader={profileLoader(queryClient)} />
            <Route path='profile/:userID' element={<Profile />} loader={profileLoader(queryClient)}>
                <Route path='favorites' element={<FavoriteLevels />} />
                <Route path='rankings' element={<Rankings />} />
            </Route>
            <Route path='notifications' element={<Notifications />} />
            <Route path='game' element={<Game />} />
            <Route path='settings' element={<Settings />}>
                <Route path='account' element={<AccountSettings />} />
                <Route path='site' element={<ClientSiteSettings />} />
                <Route path='profile' element={<ProfileSettings />} />
                <Route path='submission' element={<SubmissionSettings />} />
                <Route path='appearance' element={<Appearance />} />
                <Route path='developer' element={<Developer />} />
            </Route>
            <Route path='list' loader={() => redirect('/search')} element={<p>hi</p>} />
            <Route path='list/:listID' element={<List />} loader={listLoader(queryClient)} />
            <Route path='forgotPassword' element={<ForgotPassword />} />
            <Route path='generators' element={<Suspense fallback={<FloatingLoadingSpinner />}><Generators /></Suspense>}>
                <Route path='alphabet' element={<Alphabet />} />
                <Route path='roulette' element={<Roulette />} />
                <Route path='reverseRoulette' element={<ReverseRoulette />} />
                <Route path='tierRoulette' element={<TierRoulette />} />
                <Route path='decathlon' element={<Decathlon />} />
            </Route>
            <Route path='bulkSubmit' element={<BulkSubmit />} />
            <Route path='changeLogs' element={<Changelogs />} />
        </Route>,
        <Route path='/mod' element={<Suspense fallback={<FloatingLoadingSpinner />}><AdminLayout /></Suspense>} loader={ModLoader} errorElement={<ErrorElement />}>
            <Route index element={<ModIndex />} />
            <Route path='audit-logs' element={<AuditLogs />} />
            <Route path='beta' element={<Beta />} />
            <Route path='queue' element={<Queue />} />
            <Route path='references' element={<EditReferences />} />
            <Route path='editPack' element={<EditPack />} />
            <Route path='addSubmission' element={<AddSubmission />} />
            <Route path='editSubmission/:submissionID' element={<EditSubmission />} />
            <Route path='manageUser' element={<ManageUser />}>
                <Route path=':userID' element={<ManageUserContent />} />
            </Route>
            <Route path='createUser' element={<CreateUser />} />
            <Route path='deleteUser' element={<DeleteUser />} />
            <Route path='signupLinks' element={<SignupLink />} />
            <Route path='verification' element={<Verification />} />
            <Route path='addLevel' element={<AddLevel />} />
            <Route path='edit-level/:levelID' element={<EditLevel />} loader={levelLoader(queryClient)} />
            <Route path='editTags' element={<EditTags />} />
            <Route path='siteSettings' element={<SiteSettings />} />
            <Route path='debugging' element={<Debugging />} />
            <Route path='roles' element={<Roles />} />
            <Route path='roles/:roleID' element={<EditRole />} />
            <Route path='mergeSubmissions' element={<SubmissionMerge />} />
            <Route path={routes.staff.submissions.search.path} element={<SubmissionSearch />} />
        </Route>,
    ],
));
