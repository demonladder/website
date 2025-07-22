import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';
import Submissions from './components/Submissions';
import UserRoleIcon from '../../components/UserRoleIcon';
import LevelTracker from './components/LevelTracker';
import { AxiosError } from 'axios';
import Tracker from './components/Tracker';
import LevelResolvableText from '../../components/LevelResolvableText';
import Rankings from './components/Rankings';
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

export default function Profile() {
    const userID = parseInt(useParams().userID ?? '0') || 0;
    const openReportUserModal = useReportUserModal();

    const { status, data: userData, error } = useUserQuery(userID);
    const userColor = useUserColor(userData?.RoleIDs);

    const navigate = useNavigate();
    const contextMenu = useContextMenu([
        { text: 'Report user', onClick: () => openReportUserModal(userID) },
        { text: 'Copy profile', onClick: () => void navigator.clipboard.writeText(`https://gdladder.com/profile/${userID}`) },
        { text: 'Copy user ID', onClick: () => void navigator.clipboard.writeText(userID.toString()) },
        { text: 'Mod view', onClick: () => navigate(`/mod/manageUser/${userID}`), permission: PermissionFlags.STAFF_DASHBOARD },
    ]);

    if (status === 'pending') return <Page><LoadingSpinner /></Page>;
    if (status === 'error') {
        if ((error as AxiosError).response?.status === 404) {
            return <Page><Heading1>404: User does not exist</Heading1></Page>;
        }

        return <Page><Heading1>An error ocurred</Heading1></Page>;
    }

    if (userData === undefined) return <Page><p>No user data</p></Page>;

    function calcPref() {
        if (userData === undefined) return <InlineLoadingSpinner />;

        const { MinPref: minPref, MaxPref: maxPref } = userData;

        if (minPref === null && maxPref === null) return <span className='text-theme-400'>None</span>;
        if (minPref !== null && maxPref === null) return `>${minPref - 1}`;
        if (minPref === null && maxPref !== null) return `<${maxPref + 1}`;

        return `${minPref} to ${maxPref}`;
    }

    const pfp = `https://cdn.discordapp.com/avatars/${userData.DiscordData?.ID}/${userData.DiscordData?.Avatar}.png`;

    return (
        <Page onContextMenu={contextMenu} key={userID}>
            <Helmet>
                <title>{'GDDL - ' + userData.Name}</title>
                <meta property='og:title' content={userData.Name} />
                <meta property='og:url' content={`https://gdladder.com/profile/${userID}`} />
            </Helmet>
            <div className='mb-2 flex gap-4'>
                {userData.DiscordData?.Avatar &&
                    <img src={pfp} className='inline size-20 rounded-full' />
                }
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
                <div className='bg-theme-950 sm:round:rounded-s-xl max-sm:round:rounded-t-xl p-3 w-full sm:w-1/3'>
                    <p><b>Introduction:</b></p>
                    <p className='border-b-2 h-24 overflow-auto'>{userData.Introduction}</p>
                </div>
                <div className='p-3 bg-theme-700 sm:round:rounded-e-xl max-sm:round:rounded-b-xl flex-grow grid items-center grid-cols-1 lg:grid-cols-2 gap-x-3 max-md:gap-y-2'>
                    <LevelTracker levelID={userData.HardestID} title='Hardest' />
                    <Tracker>
                        <b>Tier preference:</b>
                        <p>{calcPref()}</p>
                    </Tracker>
                    <Tracker>
                        <b>Favorites:</b>
                        <div>
                            {userData.Favorite.length === 0 &&
                                <p className='text-theme-400'>None</p>
                            }
                            {userData.Favorite.map((favorite, i) => (<LevelResolvableText levelID={favorite} isLast={userData.Favorite.length - 1 === i} key={`userFavorites_${userData.ID}_${i}`} />))}
                        </div>
                    </Tracker>
                    <Tracker>
                        <b>Least favorites:</b>
                        <div>
                            {userData.LeastFavorite.length === 0 &&
                                <p className='text-theme-400'>None</p>
                            }
                            {userData.LeastFavorite.map((favorite, i) => (<LevelResolvableText levelID={favorite} isLast={userData.LeastFavorite.length - 1 === i} key={`userLeastFavorites_${userData.ID}_${i}`} />))}
                        </div>
                    </Tracker>
                    <Tracker>
                        <b>Total submissions:</b>
                        <p>{userData.SubmissionCount}</p>
                    </Tracker>
                    <Tracker>
                        <b>Total attempts:</b>
                        <p>{userData.TotalAttempts ?? 0}</p>
                    </Tracker>
                    <a href='#pendingSubmissions'>
                        <Tracker>
                            <b>Pending submissions:</b>
                            <p>{userData.PendingSubmissionCount}</p>
                        </Tracker>
                    </a>
                    <div className='flex flex-wrap justify-between'>
                        <b>Average enjoyment:</b>
                        <p>{userData.AverageEnjoyment?.toFixed(1) ?? '-'}</p>
                    </div>
                </div>
            </section>
            <Submissions user={userData} />
            <PendingSubmissions userID={userID} />
            <Lists userID={userID} />
            <Skills userID={userID} />
            <Rankings userID={userID} />
        </Page>
    );
}
