import ProfileButtons from '../../components/shared/ProfileButtons';
import { Link, useNavigate } from 'react-router';
import HeaderRoutes from './HeaderRoutes';
import NavItem from './NavItem';
import useUserSearch from '../../hooks/useUserSearch';
import { routes } from '../../routes/route-definitions';

export default function HeaderWide() {
    const navigate = useNavigate();
    const userSearch = useUserSearch({
        ID: 'userSearchWide',
        onUserSelect: (user) => {
            void navigate(`/profile/${user.ID}`);
        },
    });

    return (
        <header className='bg-theme-header text-theme-header-text shadow-lg border-b border-theme-outline'>
            <nav className='pe-32 flex items-center h-32'>
                <Link to='/' className='me-8'><img src='/banner-378.webp' width='378' height='129' alt='Banner featuring colorful Geometry Dash level backgrounds, game icons, and the GDDL logo in bold letters' /></Link>
                <div className='flex items-center gap-x-4 gap-y-1 text-xl'>
                    {HeaderRoutes.map((route, i) => (
                        <NavItem route={route} size={'wide'} key={`headerRoute_${i}`} />
                    ))}
                    <Link to={routes.submit.href()} className='bg-blue-600 text-white px-2 py-1 rounded-lg'>Submit</Link>
                </div>
                <div className='ms-auto flex items-center gap-4'>
                    {userSearch.SearchBox}
                    <ProfileButtons />
                </div>
            </nav>
        </header>
    );
}
