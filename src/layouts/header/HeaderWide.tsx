import ProfileButtons from '../../components/ProfileButtons';
import { Link, useNavigate } from 'react-router';
import HeaderRoutes from './HeaderRoutes';
import NavItem from './NavItem';
import useUserSearch from '../../hooks/useUserSearch';

export default function HeaderWide() {
    const navigate = useNavigate();
    const userSearch = useUserSearch({
        ID: 'userSearchWide',
        onUserSelect: (user) => {
            navigate(`/profile/${user.ID}`);
        },
    });

    return (
        <header className='bg-theme-header text-theme-header-text shadow-lg border-b border-theme-outline'>
            <nav className='pe-32 flex items-center h-32'>
                <Link to='/' className='me-8'><img src='/banner.webp' width='378' /></Link>
                <div className='flex items-center gap-x-4 gap-y-1 text-xl'>
                    {HeaderRoutes.map((route, i) => (
                        <NavItem route={route} size={'wide'} key={`headerRoute_${i}`} />
                    ))}
                </div>
                <div className='ms-auto flex items-center gap-4'>
                    {userSearch.SearchBox}
                    <ProfileButtons />
                </div>
            </nav>
        </header>
    );
}
