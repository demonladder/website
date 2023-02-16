import React from 'react';
import { redirect } from 'react-router-dom';
import serverIP from '../../serverIP';

export async function modLoader() {
    const mod = await fetch(serverIP + '/isMod', {
        credentials: 'include'
    }).then(res => res.json());

    if (!mod.isMod) return redirect('/');
    return true;
}

export default function Mod() {
    return (
        <div className='container'>
            <h1>Mod page</h1>
        </div>
    );
}