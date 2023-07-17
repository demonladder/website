import { tierToIcon } from '../../../components/DemonLogo';
import { Link } from 'react-router-dom';
import { StorageManager, User } from '../../../storageManager';

export default function ProfileButtons({ className = '' }: { className?: string }) {
    if (!StorageManager.hasSession()) {
        localStorage.removeItem('csrf');
        return <LoginButton className={className} />
    }
    
    return <ProfileButton user={StorageManager.getUser()} className={className} />;
}

function ProfileButton({ user, className = '' }: { user: User | null, className?: string }) {
    if (user === null) {
        return <LoginButton className={className} />;
    }
    
    return (
        <Link to={`/profile/${user.ID}`} className='flex items-center'>
            <span className='fs-5'>{user.Name}</span>
            <img className='ms-3 w-16' src={tierToIcon(user.Hardest)} alt='' />
        </Link>
    );
}

function LoginButton({ className = '' }: { className?: string}) {
    return (
        <div className={'py-2 flex items-center gap-4 ' + className}>
            <Link to='/signup' className='signUp align-middle'>Sign up</Link>
            <Link to='/login' className='log-in align-middle'>Log in</Link>
        </div>
    );
}