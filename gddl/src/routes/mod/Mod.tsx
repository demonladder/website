import { NavLink, Outlet, redirect } from 'react-router-dom';
import Header from '../../Header';
import serverIP from '../../serverIP';
import axios from 'axios';
import { StorageManager } from '../../storageManager';
import Container from '../../components/Container';

async function modLoader() {
    if (!StorageManager.hasSession()) return redirect('/');

    const csrfToken = StorageManager.getCSRF();
    return axios.get(serverIP + '/isMod', { withCredentials: true, params: { csrfToken } }).then(() => {
        return null;
    }).catch(() => {
        return redirect('/');
    });
}

function NavButton({ to, end = false, children }: { to: string, end?: boolean, children: React.ReactNode }) {
    return (
        <NavLink to={to} end={end} className={({isActive}) => (isActive ? 'bg-gray-600 ' : '') + 'p-3'}>{children}</NavLink>
    );
}

function Mod() {
    return (
        <div>
            <Header />
            <Container className='bg-gray-800'>
                <div className='grid grid-cols-12 gap-5'>
                    <div id='mod-menu' className='flex flex-col col-span-12 md:col-span-5 lg:col-span-3'>
                        <h1 className='text-4xl'>Mod page</h1>
                        <hr className='my-2' />
                        <div className='flex flex-col bg-gray-700'>
                            <NavButton to='/mod' end>Overview</NavButton>
                            <NavButton to='/mod/signupLinks'>Sign-up links</NavButton>
                            <NavButton to='/mod/promote'>Promote user</NavButton>
                            <NavButton to='/mod/queue'>Submissions queue</NavButton>
                            <NavButton to='/mod/references'>Edit references</NavButton>
                            <NavButton to='/mod/deleteSubmission'>Delete submission</NavButton>
                            {/* <NavButton to='/mod/createPack'>Create pack</NavButton> */}
                            {/* <NavButton to='/mod/packs'>Edit packs</NavButton> */}
                        </div>
                    </div>
                    <div className='col-span-12 md:col-span-6 lg:col-span-9'>
                        <Outlet />
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Object.assign(Mod, {
    modLoader,
});