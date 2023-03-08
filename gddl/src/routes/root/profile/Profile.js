import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import Level from './Level';
import serverIP from '../../../serverIP.js';

export async function profileLoader({ params }) {
    return await getUser(params.userID, true);
}

export default function Profile() {
    const [userData] = useState(useLoaderData());
    let user = userData.info;
    let submissions = userData.submissions;

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
                <Level info={{ isHeader: true, Name: 'Level name', Creator: 'Creator', LevelID: 'Level ID', Rating: 'Tier', Enjoyment: 'Enjoyment', UserRating: 'Rating'}} />
                <div>
                    {submissions.map(p => <Level info={p} key={p.LevelID}/>)}
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