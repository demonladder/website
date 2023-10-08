import ProfileButtons from '../../pages/root/login/ProfileButtons';
import { Link, useNavigate } from 'react-router-dom';
import UserSearchBox from '../../components/UserSearchBox';
import { User } from '../../api/users';
import HeaderRoutes from './HeaderRoutes';
import NavItem from './NavItem';

export default function HeaderWide() {
    const navigate = useNavigate();

    return (
        <header className='bg-primary text-black'>
            <nav className='px-32 flex items-center h-32'>
                <div className='me-8'>
                    <Link to='/' className='font-bold text-3xl'>GDDLadder</Link>
                </div>
                <div className='flex items-center gap-x-3 gap-y-1 text-xl'>
                    {HeaderRoutes.map((route, i) => (
                        <NavItem route={route} size={'wide'} key={'headerRoute_' + i} />
                    ))}
                </div>
                <div className='ms-auto flex items-center gap-4'>
                    <UserSearchBox<User> setResult={(user) => user && navigate('/profile/' + user.ID)} id='userSearch' />
                    <ProfileButtons />
                </div>
            </nav>
        </header>
    );
}