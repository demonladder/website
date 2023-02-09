import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import Level from './Level';

export async function profileLoader({ params }) {
    return {
        user: await getUser(params.userID),
        submissions: await getUserSubmissions(params.userID),
        progresses: await getUserProgress(params.userID)
    };
}

export default function Profile() {
    let userData = useLoaderData();
    let user = userData.user;
    let submissions = userData.submissions;
    console.log(userData);

    return (
        <div className='container'>
            <h1>{user.Name}</h1>
            <p>Introduction: {user.Introduction}</p>
            <p>Hardest: <Link to={'/level/' + user.Hardest} className='link-disable'>{user.Hardest || 'None'}</Link></p>
            <p>Favorite level: <Link to={'/level/' + user.Favorite} className='link-disable'>{user.Favorite || 'None'}</Link></p>
            <p>Least favorite level: <Link to={'/level/' + user.LeastFavorite} className='link-disable'>{user.LeastFavorite || 'None'}</Link></p>
            <p>Minimum tier preference: {user.MinPref}</p>
            <p>Maximum tier preference: {user.MaxPref}</p>
            <p>Demons completed: {userData.progresses.filter(e => e.Progress === 100).length}</p>
            <p>Submissions: {submissions.length}</p>
            <Level info={{ isHeader: true, Name: 'Level name', Creator: 'Creator', Rating: 'Tier', Progress: 'Progress'}} />
            {userData.progresses.map(p => <Level info={p} key={p.LevelID}/>)}
        </div>
    );
}

export async function getUser(id) {
    let res = await fetch(`http://localhost:8080/getUser?userID=${id}`, {
        credentials: 'include'
    }).then(res => res.json());
    return res;
}

export async function getUserSubmissions(id) {
    let res = await fetch(`http://localhost:8080/getUserSubmissions?userID=${id}`, {
        credentials: 'include'
    }).then(res => res.json());
    return res;
}

export async function getUserProgress(id) {
    let res = await fetch(`http://localhost:8080/getUserProgress?userID=${id}`, {
        credentials: 'include'
    }).then(res => res.json());
    return res;
}