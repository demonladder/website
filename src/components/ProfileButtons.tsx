import DemonFace from './DemonFace';
import { Link } from 'react-router';
import NotificationButton from './ui/Notifications';
import useNavbarNotification from '../context/NavbarNotification/useNavbarNotification';
import { useEffect } from 'react';
import useSession from '../hooks/useSession';
import { PermissionFlags } from '../features/admin/roles/PermissionFlags';

export default function ProfileButtons({ size }: { size?: 'small' | 'large' }) {
    const session = useSession();

    if (session.loadStatus === 'pending') return <LoginButton />;
    if (!session.user) return <LoginButton />;

    return <ProfileButton userID={session.user.ID} size={size} />;
}

interface Props {
    userID: number;
    size?: 'small' | 'large';
}

function ProfileButton({ userID, size = 'large' }: Props) {
    const session = useSession();

    const { discordSync } = useNavbarNotification();
    useEffect(() => {
        if (session.user && !session.user.DiscordData) {
            discordSync();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pfp = `https://cdn.discordapp.com/avatars/${session.user?.DiscordData?.ID ?? '-'}/${session.user?.DiscordData?.Avatar ?? '-'}.png`;

    return (
        <div className='flex sm:items-center gap-1 max-sm:flex-col'>
            {size === 'large' &&
                <NotificationButton />
            }
            <div className='ms-2 relative group'>
                <Link to={`/profile/${userID}`}>
                    <div className={size === 'large' ? 'size-14' : 'size-12'}>
                        {session.user?.DiscordData?.Avatar
                            ? <img src={pfp} className='rounded-full' />
                            : <DemonFace diff={session.user?.Hardest?.Meta.Difficulty} />
                        }
                    </div>
                </Link>
                <div className='max-2xl:hidden absolute opacity-0 right-0 z-40 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity'>
                    <ul className='mt-1 bg-theme-600 text-theme-text shadow round:rounded-lg flex flex-col whitespace-nowrap'>
                        <li><Link className='p-2 block round:rounded-t-lg hover:bg-theme-950/40' to={`/profile/${userID}`}><i className='bx bxs-user me-1' /> Go to profile</Link></li>
                        <li><Link className='p-2 block hover:bg-theme-950/40' to='/notifications'> <i className='bx bx-bell me-1' />Notifications</Link></li>
                        <li><Link className='p-2 block hover:bg-theme-950/40' to='/settings/profile'> <i className='bx bx-cog me-1' />Settings</Link></li>
                        {session.hasPermission(PermissionFlags.STAFF_DASHBOARD) && <li><Link className='p-2 block hover:bg-theme-950/40' to='/mod'><i className='bx bxs-dashboard me-1' /> Staff dashboard</Link></li>}
                        <li><p className='p-2 round:rounded-b-lg hover:bg-theme-950/40 cursor-pointer transition-colors' onClick={() => void session.logout()}><i className='bx bx-log-out me-1' /> Log out</p></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export function LoginButton() {
    return (
        <div className='py-2 flex items-center gap-3'>
            <Link to='/signup' className='bg-button-secondary-2 px-2 py-1 align-middle' style={{ color: 'white' }}>Sign up</Link>
            <Link to='/login' className='bg-button-primary-2 px-2 py-1 align-middle' style={{ color: 'white' }}>Log in</Link>
        </div>
    );
}
