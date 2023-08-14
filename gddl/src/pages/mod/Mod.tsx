import { Link, NavLink, Outlet, redirect } from 'react-router-dom';
import StorageManager from '../../utils/storageManager';
import Container from '../../components/Container';
import instance from '../../api/axios';

export async function modLoader() {
    if (!StorageManager.hasSession()) return redirect('/');

    const csrfToken = StorageManager.getCSRF();
    return instance.get('/isMod', { withCredentials: true, params: { csrfToken } }).then(() => {
        return null;
    }).catch(() => {
        return redirect('/');
    });
}

function NavButton({ to, end = false, children }: { to: string, end?: boolean, children: React.ReactNode }) {
    return (
        <NavLink to={to} end={end} className={({isActive}) => (isActive ? 'bg-gray-600' : 'hover:bg-gray-700') + ' px-3 py-2 round:rounded-lg transition-colors'}>{children}</NavLink>
    );
}

export default function Mod() {
    return (
        <Container className='bg-gray-800'>
            <div className='grid grid-cols-12 gap-5'>
                <div id='mod-menu' className='col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col'>
                    <Link to='/mod' className='text-4xl'>Dashboard</Link>
                    <hr className='my-2' />
                    <div className='flex flex-col select-none'>
                        <p className='text-gray-400 text-sm ps-3'>Submissions</p>
                        <NavButton to='/mod/queue'>Submissions queue</NavButton>
                        <NavButton to='/mod/addSubmission'>Add submission</NavButton>
                        <NavButton to='/mod/editSubmission'>Edit submission</NavButton>
                        <NavButton to='/mod/deleteSubmission'>Delete submission</NavButton>
                        <div className='divider my-3'></div>
                        <p className='text-gray-400 text-sm ps-3'>Users</p>
                        <NavButton to='/mod/signupLinks'>Sign-up links</NavButton>
                        <NavButton to='/mod/promote'>Promote user</NavButton>
                        <NavButton to='/mod/createUser'>Create user</NavButton>
                        <div className='divider my-3'></div>
                        <p className='text-gray-400 text-sm ps-3'>Packs</p>
                        <NavButton to='/mod/createPack'>Create pack</NavButton>
                        <NavButton to='/mod/packs'>Edit packs</NavButton>
                        <div className='divider my-3'></div>
                        <p className='text-gray-400 text-sm ps-3'>References</p>
                        <NavButton to='/mod/references'>Edit references</NavButton>
                        <div className='divider my-3'></div>
                        <p className='text-gray-400 text-sm ps-3'>Levels</p>
                        <NavButton to='/mod/addLevel'>Add level</NavButton>
                    </div>
                </div>
                <div className='col-span-12 lg:col-span-8 xl:col-span-9'>
                    <div className='bg-gray-700 p-4 round:rounded-xl'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </Container>
    );
}