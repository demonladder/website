import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Level from './Level';
import serverIP from '../../../serverIP.js';
import { useQuery } from '@tanstack/react-query';
import { GetUser } from '../../../api/users';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function Profile() {
    const userID = useParams().userID;
    const { status, error, data: userData } = useQuery({
        queryKey: ['user', userID],
        queryFn:  () => GetUser(userID)
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
                <h1>Uh oh, an error ocurred</h1>
            </div>
        );
    }

    const user = userData.info;
    const submissions = userData.submissions;

    return (
        <div className='container profile'>
            <h1>{user.Name}</h1>
            <div className='information'>
                <div className='introduction'>
                    <p><b>Introduction:</b> {user.Introduction || '-'}</p>
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
        </div>
    );
}

export async function getUser(id, all) {
    let res = await fetch(`${serverIP}/getUser?userID=${id}&all=${all === true}`, {
        credentials: 'include'
    }).then(res => res.json())
    .catch(e => e);
    return res;
}