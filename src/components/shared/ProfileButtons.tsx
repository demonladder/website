import { Link } from 'react-router';
import NotificationButton from '../ui/Notifications';
import useSession from '../../hooks/useSession';
import { difficultyToImgSrc, DemonLogoSizes } from '../../utils/difficultyToImgSrc';
import { OutlineButton } from '../ui/buttons/OutlineButton';
import { PrimaryButton } from '../ui/buttons/PrimaryButton';
import InlineLoadingSpinner from '../ui/InlineLoadingSpinner';
import { MenuIcon } from './icons';
import { useApp } from '../../context/app/useApp';

export default function ProfileButtons({ size }: { size?: 'small' | 'large' }) {
    const session = useSession();

    if (session.loadStatus === 'pending') return <InlineLoadingSpinner />;
    if (!session.user) return <LoginButton />;

    return <ProfileButton userID={session.user.ID} size={size} />;
}

interface Props {
    userID: number;
    size?: 'small' | 'large';
    showNotifications?: boolean;
    inlined?: boolean;
}

function ProfileButton({ userID, size = 'large', showNotifications = true, inlined = true }: Props) {
    const session = useSession();
    const app = useApp();

    const pfpSize = size === 'small' ? '48' : '56';

    return (
        <div className={'z-10 flex items-center gap-2' + (inlined ? '' : ' flex-col-reverse')}>
            {size === 'large' && showNotifications && <NotificationButton />}
            <div className='relative group'>
                <button onClick={() => app.set('showSideBar', true)}>
                    <div className={size === 'large' ? 'size-14' : 'size-12'}>
                        {session.user?.avatar
                            ? <img src={`https://cdn.gdladder.com/avatars/${session.user.ID}/${session.user.avatar}.png?size=${pfpSize}`} width={pfpSize} height={pfpSize} className='rounded-full' alt='Profile' />
                            : <img src={difficultyToImgSrc(session.user?.Hardest?.Meta.Difficulty, DemonLogoSizes.SMALL)} width={pfpSize} height={pfpSize} />
                        }
                    </div>
                </button>
                <div className='max-2xl:hidden absolute opacity-0 right-0 z-40 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity'>
                    <ul className='mt-1 p-1 bg-theme-900 border border-theme-400 text-theme-text shadow round:rounded-lg flex flex-col gap-1 whitespace-nowrap'>
                        <li><Link className='pe-4 py-1 block rounded-lg hover:bg-theme-700' to={`/profile/${userID}`}><i className='bx bxs-user mx-2' /> Profile</Link></li>
                        <li><p className='pe-4 py-1 rounded-lg hover:bg-theme-700 cursor-pointer transition-colors' onClick={() => void session.logout()}><i className='bx bx-log-out mx-2' /> Log out</p></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export function LoginButton() {
    const app = useApp();

    return (
        <div className='z-10 py-2 flex items-center gap-3 min-w-max'>
            <Link to='/signup'><OutlineButton size='md' className='w-full'>Sign up</OutlineButton></Link>
            <Link to='/login'><PrimaryButton size='md' className='w-full'>Log in</PrimaryButton></Link>
            <button className='hover:bg-black/15 transition-colors rounded-full p-2' onClick={() => app.set('showSideBar', true)}><MenuIcon size={32} /></button>
        </div>
    );
}
