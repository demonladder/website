import { tierToIcon } from '../../../components/DemonLogo';
import { Link } from 'react-router-dom';
import { StorageManager, User } from '../../../storageManager';

export default function ProfileButtons() {
    if (!StorageManager.hasSession()) {
        localStorage.removeItem('csrf');
        return;
        //return <LoginButton className={className} />
    }
    
    return <ProfileButton user={StorageManager.getUser()} />;
}

function ProfileButton({ user }: { user: User | null }) {
    if (user === null) {
        return;
        //return <LoginButton className={className} />;
    }
    
    return (
        <div className='flex items-center gap-1'>
            <Link to='/mod' hidden={!StorageManager.hasPermissions()}><i className='bx bx-shield-quarter text-2xl'></i></Link>
            <Link to={`/profile/${user.ID}`} className='flex items-center'>
                <span className='fs-5'>{user.Name}</span>
                <img className='ms-3 w-16' src={tierToIcon(user.Hardest)} alt='' />
            </Link>
        </div>
    );
}

// function LoginButton() {
//     return (
//         <div className='py-2 flex items-center gap-4'>
//             <Link to='/signup' className='signUp align-middle'>Sign up</Link>
//             <Link to='/login' className='log-in align-middle'>Log in</Link>
//         </div>
//     );
// }