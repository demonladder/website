import DemonLogo from '../../../components/DemonLogo';
import { Link } from 'react-router-dom';
import NotificationButton from '../../../components/ui/Notifications';
import useNavbarNotification from '../../../context/NavbarNotification/useNavbarNotification';
import { useEffect } from 'react';
import useSession from '../../../hooks/useSession';
import { PermissionFlags } from '../../mod/roles/PermissionFlags';

export default function ProfileButtons() {
    const session = useSession();

    if (session.loadStatus === 'loading') return <LoginButton />;
    if (!session.user) return <LoginButton />;

    return <ProfileButton userID={session.user.ID} username={session.user.Name} />;
}

function ProfileButton({ userID, username }: { userID: number, username: string }) {
    const session = useSession();

    const { discordSync } = useNavbarNotification();
    useEffect(() => {
        if (session.user && !session.user.DiscordData) {
            discordSync();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pfp = `https://cdn.discordapp.com/avatars/${session?.user?.DiscordData?.ID ?? '-'}/${session?.user?.DiscordData?.Avatar ?? '-'}.png`;

    return (
        <div className='flex items-center gap-1'>
            {session.hasPermission(PermissionFlags.STAFF_DASHBOARD) &&
                <Link to='/mod'><i className='bx bx-shield-quarter text-2xl' /></Link>
            }
            <NotificationButton />
            <div className='relative group'>
                <Link to={`/profile/${userID}`} className='flex items-center'>
                    <span className='fs-5'>{username}</span>
                    <div className='ms-3 w-16'>
                        {session.user?.DiscordData?.Avatar
                            ? <img src={pfp || ''} className='rounded-full' />
                            : <DemonLogo diff={session?.user?.Hardest?.Meta.Difficulty} />
                        }
                    </div>
                </Link>
                <ul className='absolute z-40 bg-theme-600 text-theme-text shadow round:rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col'>
                    <li><Link className='p-2 block round:rounded-t-lg hover:bg-theme-950/40' to={`/profile/${userID}`}>Go to profile</Link></li>
                    <li><Link className='p-2 block hover:bg-theme-950/40' to='/settings/account'>Settings</Link></li>
                    <li><p className='p-2 round:rounded-b-lg hover:bg-theme-950/40 cursor-pointer transition-colors' onClick={() => void session.logout()}>Log out</p></li>
                </ul>
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
