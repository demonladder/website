import { Link, redirect, useParams } from 'react-router-dom';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Helmet } from 'react-helmet-async';
import Submissions from './Submissions';
import StorageManager from '../../../utils/StorageManager';
import ProfileTypeIcon from '../../../components/ProfileTypeIcon';
import LevelTracker from './LevelTracker';
import { AxiosError } from 'axios';
import Container from '../../../components/Container';
import Tracker from './Tracker';
import { SecondaryButton } from '../../../components/Button';
import toFixed from '../../../utils/toFixed';
import LevelResolvableText from './LevelResolvableText';
import Rankings from './Rankings';
import Lists from './Lists';
import PendingSubmissions from './PendingSubmissions';
import useUserQuery from '../../../hooks/queries/useUserQuery';
import useUser from '../../../hooks/useUser';

export function profileLoader() {
    if (StorageManager.hasSession()) return redirect(`/profile/${StorageManager.getUser()!.userID}`);

    return redirect('/signup');
}

export default function Profile() {
    const userID = parseInt('' + useParams().userID) || 0;
    const session = useUser();

    const { status, data: userData, error } = useUserQuery(userID);

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

    const ownPage = StorageManager.hasSession() && userID === session.user?.ID;

    function calcPref() {
        if (userData === undefined) return '-';

        const { MinPref: minPref, MaxPref: maxPref } = userData;

        if (minPref === null && maxPref === null) return '-';
        if (minPref !== null && maxPref === null) return `>${minPref - 1}`;
        if (minPref === null && maxPref !== null) return `<${maxPref + 1}`;

        return `${minPref} to ${maxPref}`;
    }

    const pfp = `https://cdn.discordapp.com/avatars/${userData.DiscordData?.ID}/${userData.DiscordData?.Avatar}.png`;

    return (
        <Container key={userID}>
            <Helmet>
                <title>{'GDDL - ' + userData.Name}</title>
                <meta property='og:title' content={userData.Name} />
                <meta property='og:url' content={`https://gdladder.com/profile/${userID}`} />
            </Helmet>
            <section className='flex justify-between flex-wrap items-center'>
                <h1 className='text-4xl max-sm:basis-full mb-2'>{userData.DiscordData?.Avatar &&
                    <object data={pfp} type='image/png' className='inline w-16 rounded-full' />} {userData.Name} <ProfileTypeIcon roles={userData.Roles} />
                    <span>
                        {userData.CompletedPacks.map((p) => (
                            <Link to={`/pack/${p.PackID}`} key={p.PackID}><img src={`/packIcons/${p.IconName}`} className='inline-block me-1' width={34} height={34} /></Link>
                        ))}
                    </span>
                </h1>
                <div className='flex gap-2'>
                    <SecondaryButton onClick={session.logout} hidden={!ownPage}>Log out</SecondaryButton>
                </div>
            </section>
            <section className='flex max-sm:flex-col'>
                <div className='bg-gray-950 sm:round:rounded-s-xl max-sm:round:rounded-t-xl p-3 w-full sm:w-1/3'>
                    <p><b>Introduction:</b></p>
                    <p className='border-b-2 h-24 overflow-auto'>{userData.Introduction}</p>
                </div>
                <div className='p-3 bg-gray-700 sm:round:rounded-e-xl max-sm:round:rounded-b-xl flex-grow grid items-center grid-cols-1 lg:grid-cols-2 gap-x-3 max-md:gap-y-2'>
                    <LevelTracker levelID={userData.HardestID} title='Hardest' />
                    <Tracker>
                        <b>Tier preference:</b>
                        <p>{calcPref()}</p>
                    </Tracker>
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
                        <b>Total submissions:</b>
                        <p>{userData.TotalSubmissions}</p>
                    </Tracker>
                    <div className='hidden lg:block'>
                        <Tracker>
                            <b>Average enjoyment:</b>
                            <p>{toFixed('' + userData.AverageEnjoyment, 1, '-')}</p>
                        </Tracker>
                    </div>
                    <a href='#pendingSubmissions'>
                        <Tracker>
                            <b>Pending submissions:</b>
                            <p>{userData.PendingSubmissionCount}</p>
                        </Tracker>
                    </a>
                    <div className='lg:hidden'>
                        <Tracker>
                            <b>Average enjoyment:</b>
                            <p>{toFixed('' + userData.AverageEnjoyment, 1, '-')}</p>
                        </Tracker>
                    </div>
                </div>
            </section>
            <Submissions userID={userID} />
            <PendingSubmissions userID={userID} />
            <Lists userID={userID} />
            <Rankings userID={userID} />
        </Container>
    );
}

