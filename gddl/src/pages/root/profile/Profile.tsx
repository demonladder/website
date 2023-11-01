import { useParams } from 'react-router-dom';
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
    const userID = parseInt(''+useParams().userID) || 0;
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
        if (minPref !== null && maxPref === null) return '>' + (minPref-1);
        if (minPref === null && maxPref !== null) return '<' + (maxPref+1);

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
                <h1 className='text-4xl max-sm:basis-full mb-2'>{userData.Avatar && <img className='inline w-16 rounded-full' src={pfp} />} {userData.Name} <ProfileTypeIcon permissionLevel={userData.PermissionLevel} /></h1>
                <div className='flex gap-2'>
                    <SecondaryButton onClick={logout} hidden={!ownPage}>Log out</SecondaryButton>
                </div>
            </section>
            <section className='flex max-sm:flex-col'>
                <div className='bg-gray-950 round:rounded-s-xl p-3 w-full sm:w-1/3'>
                    <p><b>Introduction:</b></p>
                    <p className='border-b-2 h-20 overflow-auto'>{userData.Introduction}</p>
                </div>
                <div className='p-3 bg-gray-700 round:rounded-e-xl flex-grow grid items-center grid-cols-1 lg:grid-cols-2 gap-x-3'>
                    <LevelTracker levelID={userData.Hardest} title='Hardest' />
                    <Tracker>
                        <p>Favorites</p>
                        <div>
                            {userData.FavoriteLevels.map((favorite, i) => (<LevelResolvableText levelID={favorite} isLast={userData.FavoriteLevels.length - 1 === i} key={`userFavorites_${userData.ID}_${i}`} />))}
                        </div>
                    </Tracker>
                    <Tracker>
                        <p>Least favorites</p>
                        <div>
                            {userData.LeastFavoriteLevels.map((favorite, i) => (<LevelResolvableText levelID={favorite} isLast={userData.LeastFavoriteLevels.length - 1 === i} key={`userLeastFavorites_${userData.ID}_${i}`} />))}
                        </div>
                    </Tracker>
                    <Tracker>
                        <p>Tier preference:</p>
                        <p>{calcPref()}</p>
                    </Tracker>
                    <Tracker>
                        <p>Average enjoyment:</p>
                        <p>{toFixed(''+userData.AverageEnjoyment, 1, '-')}</p>
                    </Tracker>
                </div>
            </section>
            <Submissions userID={userID} />
        </Container>
    );
}