import { Link, NavLink } from 'react-router';
import { BookReaderIcon } from '../components/shared/icons/BookReaderIcon';
import { useEventListener } from 'usehooks-ts';
import ProfileButtons from '../components/shared/ProfileButtons';
import { useState } from 'react';
import useSession from '../hooks/useSession';
import { PermissionFlags } from '../features/admin/roles/PermissionFlags';
import { BellIcon, BookIcon, CogIcon, DashboardIcon, Dice5Icon, DoorOpenIcon, HomeIcon, PackageIcon, SearchIcon, UserIcon } from '../components/shared/icons';

export default function Sidebar() {
    const [show, setShow] = useState(false);
    const session = useSession();

    useEventListener('keydown', (e) => {
        if (show && e.key === 'Escape') {
            setShow(false);
            e.stopPropagation();
        }
    });

    function MenuLink({ to, children, label }: { to: string; children: React.ReactNode, label: string }) {
        return (
            <li className='not-first:mt-2 list-none'>
                <NavLink to={to} onClick={() => setShow(false)} className={({ isActive }) => 'flex align-middle gap-1 p-2 hover:bg-theme-700 transition-colors rounded-lg' + (isActive ? ' bg-theme-700 font-bold' : ' ')}>
                    {children}
                    <span>{label}</span>
                </NavLink>
            </li>
        );
    }

    return (
        <>
            <div className={'fixed inset-0 bg-black z-30 fast-effect-transition ' + (show ? 'opacity-50' : 'opacity-0 pointer-events-none')} onClick={() => setShow(false)} />
            <div
                className={
                    'h-full fixed right-0 top-0 min-w-3xs bg-theme-950 border-theme-outline z-40 fast-effect-transition ' +
                    (show ? 'border-l' : 'translate-x-full')
                }
            >
                <div className='p-2 relative'>
                    <div className='flex justify-between items-center mb-4 p-2'>
                        <h1 className='text-2xl font-bold'>GDDL</h1>
                        <button className='bx bx-x text-4xl' onClick={() => setShow(false)} />
                    </div>
                    <div className={'absolute fast-effect-transition top-6 ' + (show ? 'translate-y-10 right-1/2 translate-x-1/2 px-4' : '-translate-x-full text-theme-header-text left-0 px-6 sm:px-8 md:px-16')}>
                        <ProfileButtons onClick={() => setShow(true)} hover={!show} onMenuClose={() => setShow(false)} />
                    </div>
                    <div className='opacity-0 pointer-events-none'>
                        <ProfileButtons hover={!show} />
                    </div>
                    <MenuLink to='/' label='Home'><HomeIcon /></MenuLink>
                    <ul className='bg-theme-900 p-2 rounded-xl mt-4'>
                        <p className='px-2 text-theme-400 text-sm'>Account</p>
                        <MenuLink to={'/profile/' + session.user?.ID} label='Profile'><UserIcon /></MenuLink>
                        <MenuLink to='/notifications' label='Notifications'><BellIcon /></MenuLink>
                        <MenuLink to='/settings/profile' label='Settings'><CogIcon /></MenuLink>
                        <button onClick={() => void session.logout()} className='p-2 hover:bg-theme-700 transition-colors rounded-lg w-full mt-2 flex items-center gap-1'><DoorOpenIcon /> Sign out</button>
                    </ul>
                    <ul className='bg-theme-900 p-2 rounded-xl mt-4'>
                        <p className='px-2 text-theme-400 text-sm'>Levels</p>
                        <MenuLink to='/search' label='Levels'><SearchIcon /></MenuLink>
                        <MenuLink to='/references' label='References'><BookIcon /></MenuLink>
                        <MenuLink to='/about' label='Guidelines'><BookReaderIcon /></MenuLink>
                        <Link to='/submit' className='p-2 mt-2 transition-colors rounded-lg bg-blue-600 inline-block w-full text-center'>Submit</Link>
                    </ul>
                    <ul className='bg-theme-900 p-2 rounded-xl mt-4'>
                        <p className='px-2 text-theme-400 text-sm'>Misc</p>
                        <MenuLink to='/packs' label='Packs'><PackageIcon /></MenuLink>
                        <MenuLink to='/generators' label='Generators'><Dice5Icon /></MenuLink>
                        {session.hasPermission(PermissionFlags.STAFF_DASHBOARD) &&
                            <MenuLink to='/mod' label='Dashboard'><DashboardIcon /></MenuLink>
                        }
                    </ul>
                </div>
            </div>
        </>
    );
}
