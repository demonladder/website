import React from 'react';
import { useLoaderData } from 'react-router-dom';
import FetchPacks from '../../../../fetches/Packs.js';
import Level from '../../list/Level.js';

export async function packLoader({ params }) {
    return FetchPacks.byID(params.pack_id)
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