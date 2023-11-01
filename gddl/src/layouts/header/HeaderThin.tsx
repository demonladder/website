import { useState } from 'react';
import ProfileButtons from '../../pages/root/login/ProfileButtons';
import { Link, useNavigate } from 'react-router-dom';
import HeaderRoutes from './HeaderRoutes';
import NavItem from './NavItem';
import useUserSearch from '../../hooks/useUserSearch';

export default function HeaderThin() {
    const [navOpen, setNavOpen] = useState(false);
    const navigate = useNavigate();
    const userSearch = useUserSearch({
        ID: 'userSearchThin',
        onUserSelect: (user) => {
            navigate('/profile/' + user.ID);
        },
    });

    return (
        <header className='bg-primary text-black flex items-center justify-between flex-wrap gap-x-8 px-16 py-8'>
            <div>
                <Link to='/' className='font-bold text-3xl'>GDDLadder</Link>
            </div>
            <button onClick={() => setNavOpen(prev => !prev)}>
                <svg width='32px' height='32px' viewBox='0 0 32 32' stroke='currentColor' strokeWidth='2'>
                    <path d='M3 5h29M3 16h29M3 27h29' />
                </svg>
            </button>
            <div className='basis-full grow grid overflow-hidden transition-[grid-template-rows]' style={{ gridTemplateRows: navOpen ? '1fr' : '0fr' }}>
                <nav className='min-h-0 flex flex-col justify-between'>
                    <div className='flex flex-col gap-x-3 gap-y-1 text-xl'>
                        {HeaderRoutes.map((route, i) => (
                            <NavItem route={route} size={'thin'} key={`headerRoute_${i}`} />
                        ))}
                    </div>
                    <div className='flex max-sm:flex-col sm:items-center gap-4'>
                        <div className='my-4'>
                            {userSearch.SearchBox}
                        </div>
                        <ProfileButtons />
                    </div>
                </nav>
            </div>
        </header>
    );
}