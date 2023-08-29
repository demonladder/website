import DemonLogo from '../../../components/DemonLogo';
import { Link } from 'react-router-dom';
import StorageManager, { User } from '../../../utils/storageManager';

export default function ProfileButtons() {
    if (!StorageManager.hasSession()) {
        localStorage.removeItem('csrf');
        
        return <LoginButton />
    }
    
    return <ProfileButton user={StorageManager.getUser()} />;
}

function ProfileButton({ user }: { user: User | null }) {
    if (user === null) return (<LoginButton />);
    
    return (
        <div className='flex items-center gap-1'>
            <Link to='/mod' hidden={!StorageManager.hasPermissions()}><i className='bx bx-shield-quarter text-2xl'></i></Link>
            <Link to={`/profile/${user.ID}`} className='flex items-center'>
                <span className='fs-5'>{user.Name}</span>
                <div className='ms-3 w-16'>
                    <DemonLogo diff={user.Hardest} />
                </div>
            </Link>
        </div>
    );
}

function LoginButton() {
    return (
        <div className='py-2 flex items-center gap-3 text-white'>
            <Link to='/signup' className='bg-button-secondary-2 px-2 py-1 align-middle'>Sign up</Link>
            <Link to='/login' className='bg-button-primary-2 px-2 py-1 align-middle'>Log in</Link>
        </div>
    );
}