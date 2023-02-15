import React from 'react';
import { redirect, useLoaderData } from 'react-router-dom';

export async function modLoader() {
    return fetch('http://localhost:8080/isMod', {
        credentials: 'include'
    }).then(res => res.json());
}

export default function Mod() {
    const isMod = useLoaderData();

    if (!isMod.isMod) {
        redirect('/');
        return;
    }

    return (
        <div className='container'>
            <h1>Mod page</h1>
        </div>
    );
}