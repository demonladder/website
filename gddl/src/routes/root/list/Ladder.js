import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Level from './Level';

export async function ladderLoader() {
    return fetch('http://localhost:8080/search?tier=10&range=30')
    .then((res) => res.json());
    
}

export default function Ladder() {
    const levels = useLoaderData();

    return (
        <div>
            <Level info={{ name: 'Level Name', creator: 'Creator', id: 'Level ID', rating: 'Tier', isHeader: true}} key={-1} />
            {levels ? levels.map(l => (
                <Level info={l} key={l.id} />
            )) : <p>No levels</p>}
        </div>
    );
}