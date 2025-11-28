import { Link } from 'react-router';
import NotificationButton from './ui/Notifications';
import useNavbarNotification from '../context/NavbarNotification/useNavbarNotification';
import { useEffect } from 'react';
import useSession from '../hooks/useSession';
import { PermissionFlags } from '../features/admin/roles/PermissionFlags';
import { difficultyToImgSrc, DemonLogoSizes } from '../utils/difficultyToImgSrc';
import { OutlineButton } from './ui/buttons/OutlineButton';
import { PrimaryButton } from './ui/buttons/PrimaryButton';
import InlineLoadingSpinner from './InlineLoadingSpinner';

export default function ProfileButtons({ onClick, size }: { onClick?: () => void, size?: 'small' | 'large' }) {
    const session = useSession();

    if (session.loadStatus === 'pending') return <InlineLoadingSpinner />;
    if (!session.user) return <LoginButton />;

    return <ProfileButton onClick={onClick} userID={session.user.ID} size={size} />;
}

interface Props {
    onClick?: () => void;
    userID: number;
    size?: 'small' | 'large';
}

function ProfileButton({ onClick, userID, size = 'large' }: Props) {
    const session = useSession();

    const { discordSync } = useNavbarNotification();
    useEffect(() => {
        if (session.user && !session.user.DiscordData) {
            discordSync();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pfpSize = size === 'small' ? '48' : '56';

    return (
        <div className='flex sm:items-center gap-1 max-sm:flex-col'>
            {size === 'large' && <NotificationButton />}
            <div className='ms-2 relative group'>
                <Link to={`/profile/${userID}`} onClick={onClick}>
                    <div className={size === 'large' ? 'size-14' : 'size-12'}>
                        {session.user?.avatar
                            ? <img src={`https://cdn.gdladder.com/avatars/${session.user.ID}/${session.user.avatar}.png?size=${pfpSize}`} width={pfpSize} height={pfpSize} className='rounded-full' alt='Profile' />
                            : <img src={difficultyToImgSrc(session.user?.Hardest?.Meta.Difficulty, DemonLogoSizes.SMALL)} width='56' className='mt-1' />
                        }
                    </div>
                </Link>
                <div className='max-2xl:hidden absolute opacity-0 right-0 z-40 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity'>
                    <ul className='mt-1 p-1 bg-theme-900 border border-theme-400 text-theme-text shadow round:rounded-lg flex flex-col gap-1 whitespace-nowrap'>
                        <li><Link className='pe-4 py-1 block rounded-lg hover:bg-theme-700' to={`/profile/${userID}`}><i className='bx bxs-user mx-2' /> Profile</Link></li>
                        <li><Link className='pe-4 py-1 rounded-lg block hover:bg-theme-700' to='/notifications'><i className='bx bx-bell mx-2' /> Notifications</Link></li>
                        <li><Link className='pe-4 py-1 rounded-lg block hover:bg-theme-700' to='/settings/profile'><i className='bx bx-cog mx-2' /> Settings</Link></li>
                        {session.hasPermission(PermissionFlags.STAFF_DASHBOARD) &&
                            <li><Link className='pe-4 py-1 rounded-lg block hover:bg-theme-700' to='/mod'><i className='bx bxs-dashboard mx-2' /> Dashboard</Link></li>
                        }
                        <li><p className='pe-4 py-1 rounded-lg hover:bg-theme-700 cursor-pointer transition-colors' onClick={() => void session.logout()}><i className='bx bx-log-out mx-2' /> Log out</p></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export function LoginButton() {
    return (
        <div className='py-2 grid grid-cols-2 items-center gap-3'>
            <Link to='/signup'><OutlineButton size='md' className='w-full'>Sign up</OutlineButton></Link>
            <Link to='/login'><PrimaryButton size='md' className='w-full'>Log in</PrimaryButton></Link>
        </div>
    );
}
