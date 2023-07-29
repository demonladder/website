import { Link, NavLink, Outlet, redirect } from 'react-router-dom';
import Header from '../../Header';
import serverIP from '../../serverIP';
import axios from 'axios';
import { StorageManager } from '../../storageManager';
import Container from '../../components/Container';

export async function modLoader() {
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
        <NavLink to={to} end={end} className={({isActive}) => (isActive ? 'bg-gray-600 ' : 'hover:bg-gray-700 ') + 'px-3 py-2 round:rounded-lg'}>{children}</NavLink>
    );
}

export default function Mod() {
    return (
        <div className={StorageManager.getIsRounded() ? 'round' : ''}>
            <Header />
            <Container className='bg-gray-800'>
                <div className='flex flex-wrap gap-5'>
                    <div id='mod-menu' className='flex flex-col basis-full lg:basis-96'>
                        <Link to='/mod' className='text-4xl'>Dashboard</Link>
                        <hr className='my-2' />
                        <div className='flex flex-col'>
                            <NavButton to='/mod/queue'>Submissions queue</NavButton>
                            <NavButton to='/mod/references'>Edit references</NavButton>
                            <div className='divider my-3'></div>
                            <p className='text-gray-400 text-sm ps-3'>Users</p>
                            <NavButton to='/mod/signupLinks'>Sign-up links</NavButton>
                            <NavButton to='/mod/promote'>Promote user</NavButton>
                            <div className='divider my-3'></div>
                            <p className='text-gray-400 text-sm ps-3'>Submissions</p>
                            <NavButton to='/mod/addSubmission'>Add submission</NavButton>
                            <NavButton to='/mod/deleteSubmission'>Delete submission</NavButton>
                            <div className='divider my-3'></div>
                            <p className='text-gray-400 text-sm ps-3'>Packs</p>
                            <NavButton to='/mod/createPack'>Create pack</NavButton>
                            <NavButton to='/mod/packs'>Edit packs</NavButton>
                        </div>
                    </div>
                    <div className='flex-grow'>
                        <Outlet />
                    </div>
                </div>
            </Container>
        </div>
    );
}