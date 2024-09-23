import DemonLogo from './DemonLogo';
import useUser from '../hooks/useUser';

export default function DiscordProfilePicture() {
    const session = useUser();

    return (
        <div>
            {session.user?.DiscordData?.ID && session.user?.DiscordData?.Avatar
                ? <img src={`https://cdn.discordapp.com/avatars/${session.user.DiscordData.ID}/${session.user.DiscordData.Avatar}.png`} className='rounded-full' />
                : <DemonLogo diff={session.user?.Hardest?.Meta.Difficulty} />
            }
        </div>
    );
}