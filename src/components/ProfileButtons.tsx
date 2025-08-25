import DemonFace from './DemonFace';
import { Link } from 'react-router';
import NotificationButton from './ui/Notifications';
import useNavbarNotification from '../context/NavbarNotification/useNavbarNotification';
import { useEffect } from 'react';
import useSession from '../hooks/useSession';
import { PermissionFlags } from '../features/admin/roles/PermissionFlags';
import { DemonLogoSizes } from '../utils/difficultyToImgSrc';

export default function ProfileButtons({ onClick, size }: { onClick?: () => void, size?: 'small' | 'large' }) {
    const session = useSession();

    if (session.loadStatus === 'pending') return <LoginButton />;
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

    return (
        <div className='flex sm:items-center gap-1 max-sm:flex-col'>
            {size === 'large' &&
                <NotificationButton />
            }
            <div className='ms-2 relative group'>
                <Link to={`/profile/${userID}`} onClick={onClick}>
                    <div className={size === 'large' ? 'size-14' : 'size-12'}>
                        <object data={`/api/user/${userID}/pfp?size=56`} type='image/png' className='rounded-full'>
                            <DemonFace diff={session.user?.Hardest?.Meta.Difficulty} size={DemonLogoSizes.SMALL} />
                        </object>
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
        <div className='py-2 flex items-center gap-3'>
            <Link to='/signup' className='bg-button-secondary-2 px-2 py-1 align-middle' style={{ color: 'white' }}>Sign up</Link>
            <Link to='/login' className='bg-button-primary-2 px-2 py-1 align-middle' style={{ color: 'white' }}>Log in</Link>
        </div>
    );
}
