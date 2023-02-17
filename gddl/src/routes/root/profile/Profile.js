import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import Level from './Level';
import serverIP from '../../../serverIP.js';
import AddLevel from './AddLevel';

export async function profileLoader({ params }) {
    return await getUser(params.userID, true);
}

export default function Profile() {
    const [userData] = useState(useLoaderData());
    let user = userData.info;
    let submissions = userData.submissions;
    const [progress, setProgress] = useState(userData.progress);

    return (
        <div className='container'>
            <h1>{user.Name}</h1>
            <p>Introduction: {user.Introduction}</p>
            <p>Hardest: <Link to={'/level/' + user.Hardest} className='link-disable'>{user.Hardest || 'None'}</Link></p>
            <p>Favorite level: <Link to={'/level/' + user.Favorite} className='link-disable'>{user.Favorite || 'None'}</Link></p>
            <p>Least favorite level: <Link to={'/level/' + user.LeastFavorite} className='link-disable'>{user.LeastFavorite || 'None'}</Link></p>
            <p>Minimum tier preference: {user.MinPref}</p>
            <p>Maximum tier preference: {user.MaxPref}</p>
            <p>Submissions: {submissions.length}</p>
            <p>Demons completed: {progress.filter(e => e.Progress === 100).length}</p>
            <div className='mt-3'>
                <h1>Demon progress</h1>
                <AddLevel setProgress={setProgress} />
                <Level info={{ isHeader: true, Name: 'Level name', Creator: 'Creator', LevelID: 'Level ID', Rating: 'Tier', Progress: 'Progress'}} />
                <div>
                    {progress.map(p => <Level info={p} key={p.LevelID}/>)}
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