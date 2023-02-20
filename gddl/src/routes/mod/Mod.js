import React from 'react';
import { Link, Outlet, redirect, useResolvedPath } from 'react-router-dom';
import Header from '../../Header';
import serverIP from '../../serverIP';

export async function modLoader() {
    const mod = await fetch(serverIP + '/isMod', {
        credentials: 'include'
    }).then(res => res.json());

    if (!mod.isMod) return redirect('/');
    return null;
}

export default function Mod() {
    const path = useResolvedPath().pathname;
    
    return (
        <div>
            <Header />
            <div className='container'>
                <div className='row'>
                    <div className='d-flex flex-column flex-shrink-0 p-3 m-0 col-12 col-md-5 col-lg-4'>
                        <h1>Mod page</h1>
                        <hr />
                        <ul className='nav nav-pills flex-column mb-auto'>
                            <li className='nav-item'>
                                <Link className={`nav-link ${path === '/mod' ? 'active' : 'link-light'}`} to='/mod'>Overview</Link>
                            </li>
                            <li className='nav-item'>
                                <Link className={`nav-link ${path === '/mod/queue' ? 'active' : 'link-light'}`} to='/mod/queue'>Submissions queue</Link>
                            </li>
                        </ul>
                    </div>
                    <div className='col-12 col-md-7 col-lg-8'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}