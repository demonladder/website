import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Level from './Level';
import { useMutation, useQuery } from '@tanstack/react-query';
import { GetUser, SaveProfile } from '../../../api/users';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Save from '../../../components/Save';

export default function Profile() {
    const userID = parseInt(useParams().userID);

    const { status, data: userData } = useQuery({
        queryKey: ['user', userID],
        queryFn:  () => GetUser(userID)
    });

    const save = useMutation({
        mutationFn: SaveProfile,
        onSettled: () => setShowSave(false)
    });
    
    const [showSave, setShowSave] = useState(false);
    const [introduction, setIntroduction] = useState('');
    
    function handleSave() {
        save.mutate({ ...userData.info, Introduction: introduction });
    }
    function handleCancel() {
        setIntroduction(userData && (userData.info.Introduction || ''));
        setShowSave(false);
    }
    
    useEffect(() => {
        setIntroduction((userData && userData.info.Introduction));
    }, [status]);
    
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

    const { info: user, submissions } = userData;

    function handleIntroduction(e) {
        setIntroduction(e.target.value);
        if (!showSave) setShowSave(e.target.value !== user.Introduction);
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));

    return (
        <div className='container profile'>
            <h1>{user.Name}</h1>
            <div className='information'>
                <div className='introduction'>
                    <p className='label'><b>Introduction:</b></p>
                    <textarea value={introduction} placeholder='-' onChange={handleIntroduction} disabled={storedUser && (userID !== storedUser.ID)} />
                </div>
                <div className='trackers'>
                    <div className='tracker'>
                        <p>Hardest:</p>
                        <Link to={'/level/' + user.Hardest} className='link-disable'>{user.Hardest || '-'}</Link>
                    </div>
                    <div className='tracker'>
                        <p>Favorite level:</p>
                        <Link to={'/level/' + user.Favorite} className='link-disable'>{user.Favorite || '-'}</Link>
                    </div>
                    <div className='tracker'>
                        <p>Least favorite level:</p>
                        <Link to={'/level/' + user.LeastFavorite} className='link-disable'>{user.LeastFavorite || '-'}</Link>
                    </div>
                    <div className='tracker'>
                        <p>Minimum tier preference:</p>
                        <p>{user.MinPref || '-'}</p>
                    </div>
                    <div className='tracker'>
                        <p>Maximum tier preference:</p>
                        <p>{user.MaxPref || '-'}</p>
                    </div>
                </div>
            </div>
            <div className='mt-3'>
                <h1>Submissions [{submissions.length}]</h1>
                <div className='ratings'>
                    <Level info={{ isHeader: true }} />
                    {submissions.slice(0, 25).map(p => <Level info={p} key={p.LevelID}/>)}
                </div>
            </div>
            <Save show={showSave} onSave={handleSave} onCancel={handleCancel} loading={save.isLoading} />
        </div>
    );
}