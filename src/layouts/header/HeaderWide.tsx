import ProfileButtons from '../../pages/root/login/ProfileButtons';
import { Link, useNavigate } from 'react-router-dom';
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
        <header className='bg-primary text-black'>
            <nav className='px-32 flex items-center h-32'>
                <div className='me-8'>
                    <Link to='/' className='font-bold text-3xl'>GDDLadder</Link>
                </div>
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
