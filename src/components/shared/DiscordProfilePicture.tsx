import DemonFace from './DemonFace';
import useSession from '../../hooks/useSession';
import { DemonLogoSizes } from '../../utils/difficultyToImgSrc';

export default function DiscordProfilePicture() {
    const session = useSession();

    return (
        <div>
            {session.user?.avatar
                ? <img src={`https://cdn.gdladder.com/avatars/${session.user.ID}/${session.user.avatar}.png`} width='128' height='128' className='rounded-full' alt='Profile picture' />
                : <DemonFace diff={session.user?.Hardest?.Meta.Difficulty} size={DemonLogoSizes.LARGE} />
            }
        </div>
    );
}
