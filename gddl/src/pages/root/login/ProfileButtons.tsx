import DemonLogo from '../../../components/DemonLogo';
import { Link } from 'react-router-dom';
import StorageManager, { User } from '../../../utils/StorageManager';
import { useQuery } from '@tanstack/react-query';
import { GetUser } from '../../../api/users';
import NotificationButton from '../../../components/ui/Notifications';

export default function ProfileButtons() {
    if (!StorageManager.hasSession()) {
        localStorage.removeItem('csrf');
        
        return <LoginButton />
    }
    
    return <ProfileButton user={StorageManager.getUser()} />;
}

function ProfileButton({ user }: { user: User | null }) {
    if (user === null) return (<LoginButton />);

    const { data } = useQuery({
        queryKey: ['user', user.ID],
        queryFn: () => GetUser(user.ID),
    });

    const pfp = `https://cdn.discordapp.com/avatars/${data?.DiscordID}/${data?.Avatar}.png`;
    
    return (
        <div className='flex items-center gap-1'>
            {StorageManager.hasPermissions() &&
                <Link to='/mod'><i className='bx bx-shield-quarter text-2xl'></i></Link>
            }
            <NotificationButton />
            <Link to={`/profile/${user.ID}`} className='flex items-center'>
                <span className='fs-5'>{user.Name}</span>
                <div className='ms-3 w-16'>
                    {data?.Avatar
                        ? <img src={pfp || ''} className='rounded-full' />
                        : <DemonLogo diff={user.Hardest} />
                    }
                </div>
            </Link>
        </div>
    );
}

export function LoginButton() {
    return (
        <div className='py-2 flex items-center gap-3 text-white'>
            <Link to='/signup' className='bg-button-secondary-2 px-2 py-1 align-middle'>Sign up</Link>
            <Link to='/login' className='bg-button-primary-2 px-2 py-1 align-middle'>Log in</Link>
        </div>
    );
}