import { NavLink, Outlet, redirect } from 'react-router-dom';
import Header from '../../Header';
import serverIP from '../../serverIP';
import axios from 'axios';
import { StorageManager } from '../../storageManager';

async function modLoader() {
    if (!StorageManager.hasSession()) return redirect('/');

    const csrfToken = StorageManager.getCSRF();
    return axios.get(serverIP + '/isMod', { withCredentials: true, params: { csrfToken } }).then(() => {
        return null;
    }).catch(() => {
        return redirect('/');
    });
}

function Mod() {
    return (
        <div>
            <Header />
            <div className='container mt-4'>
                <div className='row gap-5'>
                    <div id='mod-menu' className='d-flex flex-column flex-shrink-0 p-3 m-0 col-12 col-md-5 col-lg-4'>
                        <h1>Mod page</h1>
                        <hr />
                        <div className='d-flex flex-column'>
                            <NavLink to='/mod' end>Overview</NavLink>
                            <NavLink to='/mod/signupLinks'>Sign-up links</NavLink>
                            <NavLink to='/mod/promote'>Promote user</NavLink>
                            <NavLink to='/mod/queue'>Submissions queue</NavLink>
                            <NavLink to='/mod/references'>Edit references</NavLink>
                            <NavLink to='/mod/deleteSubmission'>Delete submission</NavLink>
                            {/* <NavLink to='/mod/createPack'>Create pack</NavLink> */}
                            {/* <NavLink to='/mod/packs'>Edit packs</NavLink> */}
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

export default Object.assign(Mod, {
    modLoader,
});