import { Link, Outlet, /*NavLink as RRNavLink,*/ useNavigate, useParams } from 'react-router';
import LoadingSpinner from '../../components/LoadingSpinner';
import Submissions from './components/Submissions';
import UserRoleIcon from '../../components/UserRoleIcon';
import LevelTracker from './components/LevelTracker';
import { AxiosError } from 'axios';
import Tracker from './components/Tracker';
import Lists from './components/Lists';
import PendingSubmissions from './components/PendingSubmissions';
import useUserQuery from '../../hooks/queries/useUserQuery';
import flagEmoji from '../../utils/flagEmoji';
import Skills from './components/Skills';
import Page from '../../components/Page';
import Heading1 from '../../components/headings/Heading1';
import useContextMenu from '../../components/ui/menuContext/useContextMenu';
import { PermissionFlags } from '../admin/roles/PermissionFlags';
import { useUserColor } from '../../hooks/useUserColor';
import InlineLoadingSpinner from '../../components/InlineLoadingSpinner';
import { useReportUserModal } from '../../hooks/modals/useReportUserModal';
import { useMemo } from 'react';
import LevelPreferences from './components/LevelPreferences';
import RankingsWrapper from './components/Rankings';

export default function Profile() {
    const userID = parseInt(useParams().userID ?? '0') || 0;
    const openReportUserModal = useReportUserModal();

    const { status, data: userData, error } = useUserQuery(userID);
    const userColor = useUserColor(userID);

    const navigate = useNavigate();
    const contextMenu = useContextMenu([
        { text: 'Copy profile', onClick: () => void navigator.clipboard.writeText(`https://gdladder.com/profile/${userID}`) },
        { text: 'Copy user ID', onClick: () => void navigator.clipboard.writeText(userID.toString()) },
        { type: 'divider' },
        { text: 'Report user', onClick: () => openReportUserModal(userID) },
        { text: 'Mod view', onClick: () => navigate(`/mod/manageUser/${userID}`), permission: PermissionFlags.STAFF_DASHBOARD },
    ]);

    const pref = useMemo(() => {
        if (userData === undefined) return <InlineLoadingSpinner />;

        const { MinPref: minPref, MaxPref: maxPref } = userData;

        if (minPref === null && maxPref === null) return <span className='text-theme-400'>None</span>;
        if (minPref !== null && maxPref === null) return `>${minPref - 1}`;
        if (minPref === null && maxPref !== null) return `<${maxPref + 1}`;

        return `${minPref} to ${maxPref}`;
    }, [userData]);

    if (status === 'pending') return <Page><LoadingSpinner /></Page>;
    if (status === 'error') {
        if ((error as AxiosError).response?.status === 404) {
            return <Page><Heading1>404: User does not exist</Heading1></Page>;
        }

        return <Page><Heading1>An error ocurred</Heading1></Page>;
    }

    if (userData === undefined) return <Page><p>No user data</p></Page>;

    const pfp = `https://cdn.discordapp.com/avatars/${userData.DiscordData?.ID}/${userData.DiscordData?.Avatar}.png?size=80`;

    return (
        <Page onContextMenu={contextMenu} key={userID}>
            <title>{'GDDL - ' + userData.Name}</title>
            <meta property='og:title' content={userData.Name} />
            <meta property='og:url' content={`https://gdladder.com/profile/${userID}`} />
            <div className='mb-2 flex gap-4'>
                <object type='image/png' data={pfp} className='inline size-20 rounded-full'>
                    <i className='bx bxs-user-circle text-[80px]' />
                </object>
                <div className='grow flex flex-col gap-1 justify-center'>
                    <div className='flex items-center gap-2 text-4xl'>
                        {flagEmoji(userData.CountryCode)}
                        <Heading1 style={userColor ? { color: `#${userColor.toString(16).padStart(6, '0')}` } : {}}>{userData.Name}</Heading1>
                        <UserRoleIcon roles={userData.Roles} />
                    </div>
                    <p>
                        {userData.Pronouns &&
                            <span className='me-1'>{userData.Pronouns}</span>
                        }
                        {userData.CompletedPacks.map((p) => (
                            <Link to={`/pack/${p.PackID}`} key={p.PackID}><img src={`/packIcons/${p.IconName}`} className='inline-block me-1 w-6' /></Link>
                        ))}
                    </p>
                </div>
            </div>
            <section className='flex max-sm:flex-col' onContextMenu={(e) => e.stopPropagation()}>
                <div className='flex grow flex-col bg-theme-950 sm:round:rounded-s-xl max-sm:round:rounded-t-xl p-3 w-full min-h-40 sm:w-2/3'>
                    <p><b>Introduction:</b></p>
                    <textarea readOnly={true} className='border-b-2 block grow overflow-auto scrollbar-thin w-full outline-0' value={userData.Introduction ?? ''} />
                </div>
                <div className='sm:w-1/3 p-3 bg-theme-700 sm:round:rounded-e-xl max-sm:round:rounded-b-xl flex-grow flex flex-col gap-y-2'>
                    <LevelTracker levelID={userData.HardestID} title='Hardest' />
                    <Tracker>
                        <b>Tier preference:</b>
                        <p>{pref}</p>
                    </Tracker>
                    <div className='flex flex-wrap justify-between'>
                        <b>Average enjoyment:</b>
                        <p>{userData.AverageEnjoyment?.toFixed(1) ?? '-'}</p>
                    </div>
                    <Tracker>
                        <b>Total submissions:</b>
                        <p>{userData.SubmissionCount}</p>
                    </Tracker>
                    {userData.PendingSubmissionCount > 0 &&
                        <Tracker>
                            <b>Pending submissions:</b>
                            <p>{userData.PendingSubmissionCount}</p>
                        </Tracker>
                    }
                    <Tracker>
                        <b>Total attempts:</b>
                        <p>{userData.TotalAttempts ?? 0}</p>
                    </Tracker>
                </div>
            </section>
            {/* <nav className='my-8'>
                <ul>
                    <NavLink to='favorites'>Favorites</NavLink>
                    <NavLink to='pending-submissions'>Pending submissions</NavLink>
                    <NavLink to='lists'>Lists</NavLink>
                    <NavLink to='skills'>Skills</NavLink>
                    <NavLink to='rankings'>Rankings</NavLink>
                </ul>
            </nav> */}
            <Outlet />
            <LevelPreferences />
            <Submissions user={userData} />
            <PendingSubmissions userID={userID} />
            <Lists userID={userID} />
            <Skills userID={userID} />
            <RankingsWrapper />
        </Page>
    );
}

// function NavLink({ to, children }: { to: string, children?: React.ReactNode }) {
//     return <RRNavLink className={({ isActive }) => 'px-4 py-1 text-2xl transition-colors ' + (isActive ? 'bg-theme-600 border-b-2' : 'hover:bg-theme-700')} to={to}>{children}</RRNavLink>;
// }
