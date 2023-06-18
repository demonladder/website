import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GetUser, SaveProfile } from '../../../api/users';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Save from '../../../components/Save';
import { Helmet } from 'react-helmet';
import Submissions from './Submissions';
import { ToFixed, discriminator } from '../../../functions';
import { StorageManager } from '../../../storageManager';
import ProfileTypeIcon from '../../../components/ProfileTypeIcon';
import LevelTracker from './LevelTracker';
import { AxiosError } from 'axios';

export default function Profile() {
    const userID = parseInt(''+useParams().userID) || 0;

    const [showSave, setShowSave] = useState(false);
    const [introduction, setIntroduction] = useState('');
    
    const { status, data: userData, error } = useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID),
        onSuccess: (data) => data.Introduction && setIntroduction(data.Introduction),
    });

    const save = useMutation({
        mutationFn: SaveProfile,
        onSettled: () => setShowSave(false),
    });
    
    if (status === 'loading') {
        return (
            <div className='container profile'>
                <LoadingSpinner />
            </div>
        );
    } else if (status === 'error') {
        return (
            <div className='container profile'>
                <h1>{((error as AxiosError).response?.data as any).error || 'Uh oh, an error ocurred'}</h1>
            </div>
        );
    }
    
    function handleSave() {
        if (userData === undefined) return;

        save.mutate({ ...userData, Introduction: introduction });
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

    const storedUser = StorageManager.getUser();

    if (userData === undefined) {
        return (
            <div className="container">
                <h5>No user data</h5>
            </div>
        );
    }
    
    return (
        <div className='container profile' key={userID}>
            <Helmet>
                <title>{'GDDL - ' + userData.Name}</title>
                <meta property='og:type' content='website' />
                <meta property='og:site_name' content='GD Demon Ladder' />
                <meta property='og:title' content={userData.Name} />
                <meta property='og:url' content={`https://gdladder.com/profile/${userData.ID}`} />
                <meta property='og:description' content='The project to improve demon difficulties' />
            </Helmet>
            <h1>{userData.Name + discriminator()} <ProfileTypeIcon user={userData} /></h1>
            <div className='information'>
                <div className='introduction'>
                    <p className='label'><b>Introduction:</b></p>
                    <textarea value={introduction} placeholder='-' onChange={handleIntroduction} disabled={!(StorageManager.hasSession() && userID === storedUser?.ID)} autoCorrect='off' spellCheck={false} />
                </div>
                <div className='trackers'>
                    <LevelTracker levelID={userData.Hardest} title='Hardest' />
                    <LevelTracker levelID={userData.Favorite} title='Favorite' />
                    <LevelTracker levelID={userData.LeastFavorite} title='LeastFavorite' />
                    <div className='tracker'>
                        <p>Minimum tier preference:</p>
                        <p>{userData.MinPref || '-'}</p>
                    </div>
                    <div className='tracker'>
                        <p>Maximum tier preference:</p>
                        <p>{userData.MaxPref || '-'}</p>
                    </div>
                    <div className='tracker'>
                        <p>Average enjoyment:</p>
                        <p>{ToFixed(''+userData.AverageEnjoyment, 1, '-')}</p>
                    </div>
                </div>
            </div>
            <Submissions userID={userID} />
            <Save show={showSave} onSave={handleSave} onCancel={handleCancel} loading={save.isLoading} />
        </div>
    );
}