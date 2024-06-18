import { useQuery } from '@tanstack/react-query';
import { GetDiscordUser } from '../api/user/GetDiscordUser';
import DemonLogo from './DemonLogo';
import StorageManager from '../utils/StorageManager';

export default function DiscordProfilePicture({ userID }: { userID: number }) {
    const { data, isError } = useQuery({
        queryKey: ['discordUser', userID],
        queryFn: () => GetDiscordUser(userID),
    });

    if (isError) return;
    if (data === undefined) return;

    const user = StorageManager.getUser();

    return (
        <div>
            {data !== undefined
                ? <img src={`https://cdn.discordapp.com/avatars/${data.ID}/${data.Avatar}.png`} className='rounded-full' />
                : <DemonLogo diff={user?.Hardest} />
            }
        </div>
    );
}