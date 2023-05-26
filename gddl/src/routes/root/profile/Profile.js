import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GetUser, SaveProfile } from '../../../api/users';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Save from '../../../components/Save';
import { Helmet } from 'react-helmet';
import Submissions from './Submissions';
import { ToFixed } from '../../../functions';

export default function Profile() {
    const userID = parseInt(useParams().userID);

    const { status, data: userData } = useQuery({
        queryKey: ['user', userID],
        queryFn: () => GetUser(userID)
    });

    const save = useMutation({
        mutationFn: SaveProfile,
        onSettled: () => setShowSave(false)
    });
    
    const [showSave, setShowSave] = useState(false);
    const [introduction, setIntroduction] = useState('');
    
    function handleSave() {
        save.mutate({ ...userData, Introduction: introduction });
    }
    function handleCancel() {
        setIntroduction(userData && (userData.Introduction || ''));
        setShowSave(false);
    }
    
    useEffect(() => {
        setIntroduction((userData && userData.Introduction));
    }, [status, userData]);
    
    if (status === 'loading') {
        return (
            <div className='container profile'>
                <LoadingSpinner />
            </div>
        );
    } else if (status === 'error') {
        return (
            <div className='container profile'>
                <h1>Uh oh, an error ocurred</h1>
            </div>
        );
    }

    function handleIntroduction(e) {
        setIntroduction(e.target.value);
        if (!showSave) setShowSave(e.target.value !== userData.Introduction);
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));

    return (
        <div className='container profile'>
            <Helmet>
                <title>{'GDDL - ' + userData.Name}</title>
                <meta property='og:type' content='website' />
                <meta property='og:site_name' content='GD Demon Ladder' />
                <meta property='og:title' content={userData.Name} />
                <meta property='og:url' content={`https://gdladder.com/profile/${userData.ID}`} />
                <meta property='og:description' content='The project to improve demon difficulties' />
            </Helmet>
            <h1>{userData.Name}</h1>
            <div className='information'>
                <div className='introduction'>
                    <p className='label'><b>Introduction:</b></p>
                    <textarea value={introduction} placeholder='-' onChange={handleIntroduction} disabled={storedUser && (userID !== storedUser.ID)} />
                </div>
                <div className='trackers'>
                    <div className='tracker'>
                        <p>Hardest:</p>
                        <Link to={'/level/' + userData.Hardest} className='link-disable'>{userData.Hardest || '-'}</Link>
                    </div>
                    <div className='tracker'>
                        <p>Favorite level:</p>
                        <Link to={'/level/' + userData.Favorite} className='link-disable'>{userData.Favorite || '-'}</Link>
                    </div>
                    <div className='tracker'>
                        <p>Least favorite level:</p>
                        <Link to={'/level/' + userData.LeastFavorite} className='link-disable'>{userData.LeastFavorite || '-'}</Link>
                    </div>
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
                        <p>{ToFixed(userData.AverageEnjoyment, 1, '-')}</p>
                    </div>
                </div>
            </div>
            <Submissions userID={userID} />
            <Save show={showSave} onSave={handleSave} onCancel={handleCancel} loading={save.isLoading} />
        </div>
    );
}