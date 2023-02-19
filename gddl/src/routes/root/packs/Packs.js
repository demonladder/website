import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import serverIP from '../../../serverIP';

export async function packsLoader({ params }) {
    return fetch(serverIP + '/getPacks', {
        credentials: 'include'
    })
    .then(res => res.json())
    .catch(e => { return { error: true, message: 'Couldn\'t connect to the server!' }});
}

export default function Packs() {
    let packs = useLoaderData();

    if (packs.error) {
        return (
            <div className='container'>
                <h1>{packs.message}</h1>
            </div>
        )
    }

    packs.sort((a, b) => {
        if (a.Name < b.Name) return -1
        if (a.Name > b.Name) return 1
        return 0;
    });

    return (
        <div className='container'>
            <h1 className='mb-4'>Packs</h1>
            <div className='row'>
                {packs.map(p => <div className='mb-2 col-4 text-center' key={p.ID}><Link to={`/pack/${p.ID}`}>{p.Name}</Link></div>)}
            </div>
        </div>
    )
}