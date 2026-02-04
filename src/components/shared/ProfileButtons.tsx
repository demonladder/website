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

    return <ProfileButton size={size} />;
}

interface Props {
    size?: 'small' | 'large';
}

function ProfileButton({ size = 'large' }: Props) {
    const session = useSession();
    const app = useApp();

    const pfpSize = size === 'small' ? '48' : '64';

    return (
        <div className='z-10 flex items-center gap-2'>
            {size === 'large' && <NotificationButton />}
            <div className='relative'>
                <button onClick={() => app.set('showSideBar', true)}>
                    {session.user?.avatar ? (
                        <img
                            src={`https://cdn.gdladder.com/avatars/${session.user.ID}/${session.user.avatar}.png?size=${pfpSize}`}
                            width={pfpSize}
                            height={pfpSize}
                            className='rounded-full'
                            alt='Profile'
                        />
                    ) : (
                        <img
                            src={difficultyToImgSrc(session.user?.Hardest?.Meta.Difficulty, DemonLogoSizes.SMALL)}
                            width={pfpSize}
                            height={pfpSize}
                        />
                    )}
                </button>
            </div>
        </div>
    );
}

export function LoginButton() {
    const app = useApp();

    return (
        <div className='z-10 py-2 flex items-center gap-3 min-w-max'>
            <Link to='/signup'>
                <OutlineButton size='md' className='w-full'>
                    Sign up
                </OutlineButton>
            </Link>
            <Link to='/login'>
                <PrimaryButton size='md' className='w-full'>
                    Log in
                </PrimaryButton>
            </Link>
            <button
                className='hover:bg-black/15 transition-colors rounded-full p-2'
                onClick={() => app.set('showSideBar', true)}
            >
                <MenuIcon size={32} />
            </button>
        </div>
    );
}
