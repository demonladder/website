import { useId, useState } from 'react';
import ProfileButtons from '../../components/ProfileButtons';
import { Link, useNavigate } from 'react-router';
import HeaderRoutes from './HeaderRoutes';
import NavItem from './NavItem';
import useUserSearch from '../../hooks/useUserSearch';
import useSession from '../../hooks/useSession';
import { SecondaryButton } from '../../components/ui/buttons/SecondaryButton';
import { PermissionFlags } from '../../features/admin/roles/PermissionFlags';
import { useNotifications } from '../../features/notifications/hooks/useNotifications';

export default function HeaderThin() {
    const [navOpen, setNavOpen] = useState(false);
    const navigate = useNavigate();
    const searchID = useId();
    const userSearch = useUserSearch({
        ID: searchID,
        onUserSelect: (user) => {
            void navigate('/profile/' + user.ID);
            setNavOpen(false);
        },
    });
    const session = useSession();
    const notifications = useNotifications();

    return (
        <header className='bg-theme-header text-theme-header-text gap-x-8'>
            <div className='flex justify-between'>
                <Link to='/' className='font-bold text-3xl' onClick={() => setNavOpen(false)}><img src='/banner-300.webp' width='300' height='103' /></Link>
                <button onClick={() => setNavOpen((prev) => !prev)} className='px-8'>
                    <svg width='32px' height='32px' viewBox='0 0 32 32' stroke='currentColor' strokeWidth='2'>
                        <path d='M3 5h29M3 16h29M3 27h29' />
                    </svg>
                </button>
            </div>
            <div className='basis-full grow px-16 grid overflow-hidden transition-[grid-template-rows]' style={{ gridTemplateRows: navOpen ? '1fr' : '0fr' }}>
                <nav className='min-h-0 flex flex-col justify-between'>
                    <div className='flex flex-col gap-x-3 gap-y-1 text-xl pt-4'>
                        {HeaderRoutes.map((route, i) => (
                            <NavItem onClose={() => setNavOpen(false)} route={route} size={'thin'} key={`headerRoute_${i}`} />
                        ))}
                    </div>
                    <div className='flex max-sm:flex-col sm:items-center gap-2 pb-4'>
                        <div className='my-4'>
                            {userSearch.SearchBox}
                        </div>
                        {session.hasPermission(PermissionFlags.STAFF_DASHBOARD) && <Link className='text-xl' to='/mod' onClick={() => setNavOpen(false)}><i className='bx bx-shield-quarter' /> Dashboard</Link>}
                        <Link to='/notifications' className='text-xl' onClick={() => setNavOpen(false)}><i className={`bx ${notifications.data?.filter((n) => !n.IsRead).length ? 'bxs-bell' : 'bx-bell'}`} /> Notifications</Link>
                        <ProfileButtons onClick={() => setNavOpen(false)} size='small' />
                        <SecondaryButton onClick={() => void session.logout()}>Log out</SecondaryButton>
                    </div>
                </nav>
            </div>
        </header>
    );
}
