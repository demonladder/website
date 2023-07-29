import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetUser, SaveProfile } from '../../../api/users';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Save from '../../../components/Save';
import { Helmet } from 'react-helmet';
import Submissions from './Submissions';
import { ToFixed } from '../../../functions';
import { StorageManager } from '../../../storageManager';
import ProfileTypeIcon from '../../../components/ProfileTypeIcon';
import LevelTracker from './LevelTracker';
import { AxiosError } from 'axios';
import Container from '../../../components/Container';
import Tracker from './Tracker';
import { SecondaryButton } from '../../../components/Button';
import { useLogout } from '../../../hooks';
import { toast } from 'react-toastify';

export default function Profile() {
    const userID = parseInt(''+useParams().userID) || 0;
    const logout = useLogout();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [introduction, setIntroduction] = useState('');
    const [showSave, setShowSave] = useState(false);
    
    const { status, data: userData, error } = useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID),
    });

    useEffect(() => {
        if (userData !== undefined) setIntroduction(userData.Introduction || '');
    }, [userData]);
    
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
    
    function handleSave() {
        if (userData === undefined) return;

        toast.promise(SaveProfile({ ...userData, Introduction: introduction }).then(() => {setShowSave(false); queryClient.invalidateQueries(['user', userID])}), {
            pending: 'Saving...',
            success: 'Saved!',
            error: 'An error occurred',
        });
    }
    function handleCancel() {
        setShowSave(false);
        setIntroduction(userData?.Introduction || '');
    }

    function handleIntroduction(e: any) {
        setIntroduction(e.target.value);
        if (userData === undefined) return;
        if (!showSave) setShowSave(e.target.value !== userData.Introduction);
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
    
    return (
        <Container key={userID} className=''>
            <Helmet>
                <title>{'GDDL - ' + userData.Name}</title>
                <meta property='og:type' content='website' />
                <meta property='og:site_name' content='GD Demon Ladder' />
                <meta property='og:title' content={userData.Name} />
                <meta property='og:url' content={`https://gdladder.com/profile/${userData.ID}`} />
                <meta property='og:description' content='The project to improve demon difficulties' />
            </Helmet>
            <div className='flex justify-between flex-wrap items-center'>
                <h1 className='text-4xl max-sm:basis-full mb-2'>{userData.Name} <ProfileTypeIcon user={userData} /></h1>
                <div className='flex gap-2'>
                    <SecondaryButton onClick={() => navigate('/profile/settings')} className={ownPage ? 'flex items-center gap-1' : ''} hidden={!ownPage}>Edit <i className='bx bx-cog'></i></SecondaryButton>
                    <SecondaryButton onClick={logout} hidden={!ownPage}>Log out</SecondaryButton>
                </div>
            </div>
            <div className='flex max-sm:flex-col'>
                <div className='flex flex-col bg-gray-950 round:rounded-s-xl p-3 w-full sm:w-1/3'>
                    <p><b>Introduction:</b></p>
                    <textarea className='flex-grow bg-transparent resize-none border-b-2 outline-none' value={introduction} placeholder='-' onChange={handleIntroduction} disabled={!ownPage} autoCorrect='off' spellCheck={false} />
                </div>
                <div className='p-3 bg-gray-700 round:rounded-e-xl flex-grow grid grid-cols-1 lg:grid-cols-2 gap-x-3'>
                    <LevelTracker levelID={userData.Hardest} title='Hardest' />
                    <LevelTracker levelID={userData.Favorite} title='Favorite' />
                    <LevelTracker levelID={userData.LeastFavorite} title='Least favorite' />
                    <Tracker>
                        <p>Tier preference:</p>
                        <p>{calcPref()}</p>
                    </Tracker>
                    <Tracker>
                        <p>Average enjoyment:</p>
                        <p>{ToFixed(''+userData.AverageEnjoyment, 1, '-')}</p>
                    </Tracker>
                </div>
            </div>
            <Submissions userID={userID} />
            <Save show={showSave} onSave={handleSave} onCancel={handleCancel} loading={false} />
        </Container>
    );
}