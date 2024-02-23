import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GetUser } from '../../../api/users';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Helmet } from 'react-helmet';
import Submissions from './Submissions';
import StorageManager from '../../../utils/StorageManager';
import ProfileTypeIcon from '../../../components/ProfileTypeIcon';
import LevelTracker from './LevelTracker';
import { AxiosError } from 'axios';
import Container from '../../../components/Container';
import Tracker from './Tracker';
import { SecondaryButton } from '../../../components/Button';
import useLogout from '../../../hooks/useLogout';
import toFixed from '../../../utils/toFixed';
import LevelResolvableText from './LevelResolvableText';

export default function Profile() {
    const userID = parseInt('' + useParams().userID) || 0;
    const logout = useLogout();

    const { status, data: userData, error } = useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID),
    });

    if (status === 'loading') {
        return (
            <Container>
                <LoadingSpinner />
            </Container>
        );
    } else if (status === 'error') {
        if ((error as AxiosError).response?.status === 404) {
            return (
                <Container>
                    <h1>User does not exist</h1>
                </Container>
            );
        }

        return (
            <Container>
                <h1>An error ocurred</h1>
            </Container>
        );
    }


    if (userData === undefined) {
        return (
            <div className='container'>
                <h5>No user data</h5>
            </div>
        );
    }

    const storedUser = StorageManager.getUser();
    const ownPage = StorageManager.hasSession() && userID === storedUser?.ID;

    function calcPref() {
        if (userData === undefined) return '-';

        const { MinPref: minPref, MaxPref: maxPref } = userData;

        if (minPref === null && maxPref === null) return '-';
        if (minPref !== null && maxPref === null) return '>' + (minPref - 1);
        if (minPref === null && maxPref !== null) return '<' + (maxPref + 1);

        return minPref + ' to ' + maxPref;
    }

    const pfp = `https://cdn.discordapp.com/avatars/${userData.DiscordID}/${userData.Avatar}.png`;

    return (
        <Container key={userID}>
            <Helmet>
                <title>{'GDDL - ' + userData.Name}</title>
                <meta property='og:type' content='website' />
                <meta property='og:site_name' content='GD Demon Ladder' />
                <meta property='og:title' content={userData.Name} />
                <meta property='og:url' content={`https://gdladder.com/profile/${userData.ID}`} />
                <meta property='og:description' content='The project to improve demon difficulties' />
            </Helmet>
            <section className='flex justify-between flex-wrap items-center'>
                <h1 className='text-4xl max-sm:basis-full mb-2'>{userData.Avatar &&
                    <object data={pfp} type='image/png' className='inline w-16 rounded-full' />} {userData.Name} <ProfileTypeIcon permissionLevel={userData.PermissionLevel} />
                    <span>
                        {userData.CompletedPacks.map((p) => (
                            <Link to={`/pack/${p.PackID}`}><img src={`/packIcons/${p.IconName}`} className='inline-block me-1' width={34} height={34} /></Link>
                        ))}
                    </span>
                </h1>
                <div className='flex gap-2'>
                    <SecondaryButton onClick={logout} hidden={!ownPage}>Log out</SecondaryButton>
                </div>
            </section>
            <section className='flex max-sm:flex-col'>
                <div className='bg-gray-950 sm:round:rounded-s-xl max-sm:round:rounded-t-xl p-3 w-full sm:w-1/3'>
                    <p><b>Introduction:</b></p>
                    <p className='border-b-2 h-24 overflow-auto'>{userData.Introduction}</p>
                </div>
                <div className='p-3 bg-gray-700 sm:round:rounded-e-xl max-sm:round:rounded-b-xl flex-grow grid items-center grid-cols-1 lg:grid-cols-2 gap-x-3 max-md:gap-y-2'>
                    <LevelTracker levelID={userData.Hardest} title='Hardest' />
                    <Tracker>
                        <b>Favorites:</b>
                        <div>
                            {userData.FavoriteLevels.length === 0 &&
                                <p>None</p>
                            }
                            {userData.FavoriteLevels.map((favorite, i) => (<LevelResolvableText levelID={favorite} isLast={userData.FavoriteLevels.length - 1 === i} key={`userFavorites_${userData.ID}_${i}`} />))}
                        </div>
                    </Tracker>
                    <Tracker>
                        <b>Least favorites:</b>
                        <div>
                            {userData.LeastFavoriteLevels.length === 0 &&
                                <p>None</p>
                            }
                            {userData.LeastFavoriteLevels.map((favorite, i) => (<LevelResolvableText levelID={favorite} isLast={userData.LeastFavoriteLevels.length - 1 === i} key={`userLeastFavorites_${userData.ID}_${i}`} />))}
                        </div>
                    </Tracker>
                    <Tracker>
                        <b>Tier preference:</b>
                        <p>{calcPref()}</p>
                    </Tracker>
                    <Tracker>
                        <b>Average enjoyment:</b>
                        <p>{toFixed('' + userData.AverageEnjoyment, 1, '-')}</p>
                    </Tracker>
                    <Tracker>
                        <b>Total submisisons:</b>
                        <p>{userData.TotalSubmissions}</p>
                    </Tracker>
                    <Link to='/pendingSubmissions'>
                        <Tracker>
                            <b>Pending submisisons:</b>
                            <p>{userData.PendingSubmissionCount}</p>
                        </Tracker>
                    </Link>
                </div>
            </section>
            <Submissions userID={userID} />
        </Container>
    );
}

