import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Level from '../../list/Level.js';
import serverIP from '../../../../serverIP.js';

export async function packLoader({ params }) {
    return fetch(`${serverIP}/getPack?packID=${params.pack_id}`, {
        credentials: 'include'
    })
    .then(res => res.json())
    .catch(e => { return { error: true, message: 'Couldn\'t connect to the server!' }});
}

export default function PackOverview() {
    let pack = useLoaderData();

    if (pack.error) {
        return (
            <div className='container'>
                <h1>{pack.message}</h1>
            </div>
        )
    }
    
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