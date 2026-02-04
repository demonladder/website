import { Link, NavLink } from 'react-router';
import { BookReaderIcon } from '../components/shared/icons/BookReaderIcon';
import { useEventListener } from 'usehooks-ts';
import useSession from '../hooks/useSession';
import { PermissionFlags } from '../features/admin/roles/PermissionFlags';
import { BellIcon, BookIcon, CogIcon, DashboardIcon, Dice5Icon, DoorOpenIcon, HomeIcon, PackageIcon, SearchIcon, UserIcon, XIcon } from '../components/shared/icons';
import { DemonLogoSizes, difficultyToImgSrc } from '../utils/difficultyToImgSrc';
import { useApp } from '../context/app/useApp';

function MenuLink({ to, children, label }: { to: string; children: React.ReactNode, label: string }) {
    const app = useApp();

    return (
        <li className='not-first:mt-2 list-none'>
            <NavLink to={to} onClick={() => app.set('showSideBar', false)} className={({ isActive }) => 'flex align-middle gap-1 p-2 hover:bg-theme-700 transition-colors rounded-lg' + (isActive ? ' bg-theme-700 font-bold' : ' ')}>
                {children}
                <span>{label}</span>
            </NavLink>
        </li>
    );
}

export default function Sidebar() {
    const app = useApp();
    const show = app.showSideBar;
    const setShow = (value: boolean) => app.set('showSideBar', value);
    const session = useSession();

    useEventListener('keydown', (e) => {
        if (show && e.key === 'Escape') {
            setShow(false);
            e.stopPropagation();
        }
    });

    function onSignOut() {
        void session.logout();
        setShow(false);
    }

    return (
        <>
            <div className={'fixed inset-0 bg-black z-30 fast-effect-transition ' + (show ? 'opacity-50' : 'opacity-0 pointer-events-none')} onClick={() => setShow(false)} />
            <div
                className={
                    'h-full max-h-dvh overflow-y-auto fixed right-0 top-0 min-w-xs md:min-w-3xs bg-theme-950 border-theme-outline z-40 fast-effect-transition ' +
                    (show ? 'border-l' : 'translate-x-full')
                }
            >
                <div className='p-2 relative'>
                    <div className='mb-4 p-2 h-9 flex items-center justify-between'>
                        <h1 className='text-2xl font-bold'>GDDL</h1>
                        <button onClick={() => setShow(false)}><XIcon size={36} /></button>
                    </div>
                    {session.user &&
                        <div>
                            {session.user?.avatar
                                ? <img src={`https://cdn.gdladder.com/avatars/${session.user.ID}/${session.user.avatar}.png?size=${56}`} width={56} height={56} className='rounded-full mx-auto' />
                                : <img src={difficultyToImgSrc(session.user?.Hardest?.Meta.Difficulty, DemonLogoSizes.SMALL)} width={56} height={56} className='mx-auto' />
                            }
                            <p className='text-lg text-center'>{session.user.Name}</p>
                        </div>
                    }
                    <MenuLink to='/' label='Home'><HomeIcon /></MenuLink>
                    {session.hasPermission(PermissionFlags.STAFF_DASHBOARD) &&
                        <MenuLink to='/mod' label='Dashboard'><DashboardIcon /></MenuLink>
                    }
                    {session.user &&
                        <ul className='bg-theme-900 p-2 rounded-xl mt-4'>
                            <p className='px-2 text-theme-400 text-sm'>Account</p>
                            <MenuLink to={'/profile/' + session.user?.ID} label='Profile'><UserIcon /></MenuLink>
                            <MenuLink to='/notifications' label='Notifications'><BellIcon /></MenuLink>
                            <MenuLink to='/settings/profile' label='Settings'><CogIcon /></MenuLink>
                            <button onClick={onSignOut} className='p-2 hover:bg-theme-700 transition-colors rounded-lg w-full mt-2 flex items-center gap-1'><DoorOpenIcon /> Sign out</button>
                        </ul>
                    }
                    <ul className='bg-theme-900 p-2 rounded-xl mt-4'>
                        <p className='px-2 text-theme-400 text-sm'>Levels</p>
                        <MenuLink to='/search' label='Levels'><SearchIcon /></MenuLink>
                        <MenuLink to='/references' label='References'><BookIcon /></MenuLink>
                        <MenuLink to='/about' label='Guidelines'><BookReaderIcon /></MenuLink>
                        {session.user &&
                            <Link to='/submit' className='p-2 mt-2 transition-colors rounded-lg bg-blue-600 inline-block w-full text-center'>Submit</Link>
                        }
                    </ul>
                    <ul className='bg-theme-900 p-2 rounded-xl mt-4'>
                        <p className='px-2 text-theme-400 text-sm'>Misc</p>
                        <MenuLink to='/packs' label='Packs'><PackageIcon /></MenuLink>
                        <MenuLink to='/generators' label='Generators'><Dice5Icon /></MenuLink>
                    </ul>
                </div>
            </div>
        </>
    );
}
