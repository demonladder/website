import DemonLogo from './DemonLogo';
import useSession from '../hooks/useSession';

export default function DiscordProfilePicture() {
    const session = useSession();

    return (
        <div>
            {session.user?.DiscordData?.ID && session.user?.DiscordData?.Avatar
                ? <img src={`https://cdn.discordapp.com/avatars/${session.user.DiscordData.ID}/${session.user.DiscordData.Avatar}.png`} className='rounded-full' />
                : <DemonLogo diff={session.user?.Hardest?.Meta.Difficulty} />
            }
        </div>
    );
}