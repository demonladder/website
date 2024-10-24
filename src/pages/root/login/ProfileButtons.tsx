import DemonLogo from '../../../components/DemonLogo';
import { Link } from 'react-router-dom';
import NotificationButton from '../../../components/ui/Notifications';
import useNavbarNotification from '../../../context/NavbarNotification/useNavbarNotification';
import { useEffect } from 'react';
import useUser from '../../../hooks/useUser';
import { PermissionFlags } from '../../mod/roles/PermissionFlags';
import InlineLoadingSpinner from '../../../components/InlineLoadingSpinner';

export default function ProfileButtons() {
    const session = useUser();

    if (session.hasCookie && session.loadStatus === 'loading') return <InlineLoadingSpinner />;

    if (!session.user) {
        return <LoginButton />
    }

    return <ProfileButton userID={session.user.ID} username={session.user.Name} />;
}

function ProfileButton({ userID, username }: { userID: number, username: string }) {
    const session = useUser();

    const { discordSync } = useNavbarNotification();
    useEffect(() => {
        if (session.user && !session?.user?.DiscordData) {
            discordSync();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pfp = `https://cdn.discordapp.com/avatars/${session?.user?.DiscordData?.ID ?? '-'}/${session?.user?.DiscordData?.Avatar ?? '-'}.png`;

    return (
        <div className='flex items-center gap-1'>
            {session.hasPermission(PermissionFlags.STAFF_DASHBOARD) &&
                <Link to='/mod'><i className='bx bx-shield-quarter text-2xl'></i></Link>
            }
            <NotificationButton />
            <Link to={`/profile/${userID}`} className='flex items-center'>
                <span className='fs-5'>{username}</span>
                <div className='ms-3 w-16'>
                    {session?.user?.DiscordData?.Avatar
                        ? <img src={pfp || ''} className='rounded-full' />
                        : <DemonLogo diff={session?.user?.Hardest?.Meta.Difficulty} />
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