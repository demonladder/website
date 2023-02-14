import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';

export async function packsLoader({ params }) {
    return fetch('http://localhost:8080/getPacks', {
        credentials: 'include'
    })
    .then(res => res.json());
}

export default function Packs() {
    let packs = useLoaderData();
    console.log(packs);

    return (
        <div className='container'>
            <h1 className='mb-4'>Packs</h1>
            <div className='row'>
                {packs.map(p => <Link to={`/pack/${p.ID}`} className='col-4 mb-2' key={p.ID}>{p.Name}</Link>)}
            </div>
        </div>
    )
}