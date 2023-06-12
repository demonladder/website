import React from 'react';
import { Link, Outlet, redirect, useLocation } from 'react-router-dom';
import Header from '../../Header';
import serverIP from '../../serverIP';
import axios from 'axios';
import { StorageManager } from '../../storageManager';

export async function modLoader() {
    if (!StorageManager.hasSession()) return redirect('/');

    return axios.get(serverIP + '/isMod', { headers: StorageManager.authHeader() }).then((response) => {
        return null;
    }).catch((error) => {
        return redirect('/');
    });
}

export default function Mod() {
    const path = useLocation().pathname;
    
    return (
        <div>
            <Header />
            <div className='container'>
                <div className='row gap-5'>
                    <div id='mod-menu' className='d-flex flex-column flex-shrink-0 p-3 m-0 col-12 col-md-5 col-lg-4'>
                        <h1>Mod page</h1>
                        <hr />
                        <div className='d-flex flex-column'>
                            <Link className={`${path === '/mod' ? 'active' : 'link-light'}`} to='/mod'>Overview</Link>
                            <Link className={`${path === '/mod/queue' ? 'active' : 'link-light'}`} to='/mod/queue'>Submissions queue</Link>
                            <Link className={`${path === '/mod/packs' ? 'active' : 'link-light'}`} to='/mod/packs'>Edit packs</Link>
                            <Link className={`${path === '/mod/createPack' ? 'active' : 'link-light'}`} to='/mod/createPack'>Create pack</Link>
                            <Link className={`${path === '/mod/references' ? 'active' : 'link-light'}`} to='/mod/references'>Edit references</Link>
                        </div>
                    </div>
                    <div className='col-12 col-md-6 col-lg-7'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}