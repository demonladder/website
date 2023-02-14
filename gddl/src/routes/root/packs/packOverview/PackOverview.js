import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Level from '../../list/Level.js';

export async function packLoader({ params }) {
    return fetch(`http://localhost:8080/getPack?packID=${params.pack_id}`, {
        credentials: 'include'
    })
    .then(res => res.json());
}

export default function PackOverview() {
    let pack = useLoaderData();

    return (
        <div className='container'>
            <h1>{pack.Name}</h1>
            <div id='levelList' className='my-3'>
                <Level info={{ Name: 'Level Name', Song: 'Song', Creator: 'Creator', ID: 'Level ID', Rating: 'Tier', isHeader: true}} key={-1} classes='head' />
                {pack.Levels.map(l => (
                    <Level info={l} key={l.ID} />
                ))}
            </div>
        </div>
    );
}