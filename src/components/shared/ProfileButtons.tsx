import { Link } from 'react-router';
import NotificationButton from '../ui/Notifications';
import useSession from '../../hooks/useSession';
import { difficultyToImgSrc, DemonLogoSizes } from '../../utils/difficultyToImgSrc';
import { OutlineButton } from '../ui/buttons/OutlineButton';
import { PrimaryButton } from '../ui/buttons/PrimaryButton';
import InlineLoadingSpinner from '../ui/InlineLoadingSpinner';
import { MenuIcon } from './icons';

export default function ProfileButtons({ hover, onClick, size, onMenuClose: closeMenu }: { hover: boolean, onClick?: () => void, size?: 'small' | 'large', onMenuClose?: () => void }) {
    const session = useSession();

    if (session.loadStatus === 'pending') return <InlineLoadingSpinner />;
    if (!session.user) return <LoginButton onMenu={onClick} onMenuClose={closeMenu} showMenuButton={hover} />;

    return <ProfileButton hover={hover} onClick={onClick} userID={session.user.ID} size={size} showNotifications={hover} inlined={hover} />;
}

interface Props {
    hover?: boolean;
    onClick?: () => void;
    userID: number;
    size?: 'small' | 'large';
    showNotifications?: boolean;
    inlined?: boolean;
}

function ProfileButton({ hover, onClick, userID, size = 'large', showNotifications = true, inlined = true }: Props) {
    const session = useSession();

    const pfpSize = size === 'small' ? '48' : '56';

    return (
        <div className={'flex items-center gap-2' + (inlined ? '' : ' flex-col-reverse')}>
            {size === 'large' && showNotifications && <NotificationButton />}
            <span className='text-lg max-sm:hidden'>{session.user?.Name}</span>
            <div className='relative group'>
                <button onClick={onClick}>
                    <div className={size === 'large' ? 'size-14' : 'size-12'}>
                        {session.user?.avatar
                            ? <img src={`https://cdn.gdladder.com/avatars/${session.user.ID}/${session.user.avatar}.png?size=${pfpSize}`} width={pfpSize} height={pfpSize} className='rounded-full' alt='Profile' />
                            : <img src={difficultyToImgSrc(session.user?.Hardest?.Meta.Difficulty, DemonLogoSizes.SMALL)} width={pfpSize} height={pfpSize} />
                        }
                    </div>
                </button>
                {hover &&
                    <div className='max-2xl:hidden absolute opacity-0 right-0 z-40 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity'>
                        <ul className='mt-1 p-1 bg-theme-900 border border-theme-400 text-theme-text shadow round:rounded-lg flex flex-col gap-1 whitespace-nowrap'>
                            <li><Link className='pe-4 py-1 block rounded-lg hover:bg-theme-700' to={`/profile/${userID}`}><i className='bx bxs-user mx-2' /> Profile</Link></li>
                            <li><p className='pe-4 py-1 rounded-lg hover:bg-theme-700 cursor-pointer transition-colors' onClick={() => void session.logout()}><i className='bx bx-log-out mx-2' /> Log out</p></li>
                        </ul>
                    </div>
                }
            </div>
        </div>
    );
}

export function LoginButton({ onMenu, showMenuButton, onMenuClose }: { onMenu?: () => void, showMenuButton: boolean, onMenuClose?: () => void }) {
    return (
        <div className='py-2 flex items-center gap-3 min-w-max'>
            <Link onClick={onMenuClose} to='/signup'><OutlineButton size='md' className='w-full'>Sign up</OutlineButton></Link>
            <Link onClick={onMenuClose} to='/login'><PrimaryButton size='md' className='w-full'>Log in</PrimaryButton></Link>
            {showMenuButton && <button onClick={onMenu}><MenuIcon /></button>}
        </div>
    );
}
