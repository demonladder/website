import { useId, useState } from 'react';
import ProfileButtons from '../../pages/root/login/ProfileButtons';
import { Link, useNavigate } from 'react-router-dom';
import HeaderRoutes from './HeaderRoutes';
import NavItem from './NavItem';
import useUserSearch from '../../hooks/useUserSearch';
import useSession from '../../hooks/useSession';
import { SecondaryButton } from '../../components/ui/buttons/SecondaryButton';

export default function HeaderThin() {
    const [navOpen, setNavOpen] = useState(false);
    const navigate = useNavigate();
    const searchID = useId();
    const userSearch = useUserSearch({
        ID: searchID,
        onUserSelect: (user) => {
            navigate('/profile/' + user.ID);
        },
    });
    const session = useSession();

    return (
        <header className='bg-theme-header text-theme-header-text gap-x-8'>
            <div className='flex justify-between'>
                <Link to='/' className='font-bold text-3xl'><img src='/assets/banner.png' width='300' /></Link>
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
                            <NavItem route={route} size={'thin'} key={`headerRoute_${i}`} />
                        ))}
                    </div>
                    <div className='flex max-sm:flex-col sm:items-center gap-4 pb-4'>
                        <div className='my-4'>
                            {userSearch.SearchBox}
                        </div>
                        <ProfileButtons />
                        <SecondaryButton onClick={() => void session.logout()}>Log out</SecondaryButton>
                    </div>
                </nav>
            </div>
        </header>
    );
}
