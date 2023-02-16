import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import Level from './Level';
import serverIP from '../../../serverIP.js';

export async function profileLoader({ params }) {
    return await getUser(params.userID);
}

export default function Profile() {
    let [userData] = useOutletContext();
    let user = userData.info;
    let submissions = userData.submissions;
    let progress = userData.progress;

    return (
        <div className='container'>
            <h1>{user.Name}</h1>
            <p>Introduction: {user.Introduction}</p>
            <p>Hardest: <Link to={'/level/' + user.Hardest} className='link-disable'>{user.Hardest || 'None'}</Link></p>
            <p>Favorite level: <Link to={'/level/' + user.Favorite} className='link-disable'>{user.Favorite || 'None'}</Link></p>
            <p>Least favorite level: <Link to={'/level/' + user.LeastFavorite} className='link-disable'>{user.LeastFavorite || 'None'}</Link></p>
            <p>Minimum tier preference: {user.MinPref}</p>
            <p>Maximum tier preference: {user.MaxPref}</p>
            <p>Demons completed: {progress.filter(e => e.Progress === 100).length}</p>
            <p>Submissions: {submissions.length}</p>
            <Level info={{ isHeader: true, Name: 'Level name', Creator: 'Creator', Rating: 'Tier', Progress: 'Progress'}} />
            {progress.map(p => <Level info={p} key={p.LevelID}/>)}
        </div>
    );
}

export async function getUser(id) {
    let res = await fetch(`${serverIP}/getUser?userID=${id}`, {
        credentials: 'include'
    }).then(res => res.json())
    .catch(e => e);
    return res;
}