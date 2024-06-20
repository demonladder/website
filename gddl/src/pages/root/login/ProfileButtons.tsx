import DemonLogo from '../../../components/DemonLogo';
import { Link } from 'react-router-dom';
import StorageManager from '../../../utils/StorageManager';
import { useQuery } from '@tanstack/react-query';
import GetDiscordUser from '../../../api/user/GetDiscordUser';
import NotificationButton from '../../../components/ui/Notifications';
import useUserQuery from '../../../hooks/queries/useUserQuery';

export default function ProfileButtons() {
    const user = StorageManager.getUser();

    if (!StorageManager.hasSession() || !user) {
        return <LoginButton />
    }

    return <ProfileButton userID={user.ID} username={user.Name} />;
}

function ProfileButton({ userID, username }: { userID: number, username: string }) {
    const { data: discordData } = useQuery({
        queryKey: ['user', userID, 'discord'],
        queryFn: () => GetDiscordUser(userID),
    });

    const { data: userData } = useUserQuery(userID);

    const pfp = `https://cdn.discordapp.com/avatars/${discordData?.ID}/${discordData?.Avatar}.png`;

    return (
        <div className='flex items-center gap-1'>
            {StorageManager.hasPermissions() &&
                <Link to='/mod'><i className='bx bx-shield-quarter text-2xl'></i></Link>
            }
            <NotificationButton />
            <Link to={`/profile/${userID}`} className='flex items-center'>
                <span className='fs-5'>{username}</span>
                <div className='ms-3 w-16'>
                    {discordData?.Avatar
                        ? <img src={pfp || ''} className='rounded-full' />
                        : <DemonLogo diff={userData?.Hardest.Meta.Difficulty} />
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