import DemonFace from './DemonFace';
import useSession from '../hooks/useSession';
import { DemonLogoSizes } from '../utils/difficultyToImgSrc';

export default function DiscordProfilePicture() {
    const session = useSession();

    return (
        <div>
            <object data={`/api/user/${session.user?.ID}/pfp?size=128`} type='image/png' className='rounded-full'>
                <DemonFace diff={session.user?.Hardest?.Meta.Difficulty} size={DemonLogoSizes.LARGE} />
            </object>
        </div>
    );
}
