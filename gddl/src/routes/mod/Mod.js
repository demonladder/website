import React from 'react';
import { Link, Outlet, redirect } from 'react-router-dom';
import Header from '../../Header';
import serverIP from '../../serverIP';

export async function modLoader() {
    const mod = await fetch(serverIP + '/isMod', {
        credentials: 'include'
    }).then(res => res.json());

    if (!mod.isMod) return redirect('/');
    return redirect('/mod/queue');
}

export default function Mod() {
    return (
        <div>
            <Header />
            <div className='container d-flex'>
                <div className='d-flex flex-column flex-shrink-0 p-3 m-0' style={{width: '280px'}}>
                    <h1>Mod page</h1>
                    <hr />
                    <ul className='nav nav-pills flex-column mb-auto'>
                        <li className='nav-item'>
                            <Link className='nav-link active' to='/mod'>Submissions queue</Link>
                        </li>
                    </ul>
                </div>
                <Outlet />
            </div>
        </div>
    );
}