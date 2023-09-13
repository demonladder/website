import { useQuery } from '@tanstack/react-query';
import { GetDiscordUser } from '../api/users';

export default function DiscordUser({ userID }: { userID: number }) {
    const { data, isError } = useQuery({
        queryKey: ['discordUser', userID],
        queryFn: () => GetDiscordUser(userID),
    });

    if (isError) return;
    if (data === undefined) return;

    return (
        <div className='flex gap-3 mb-4'>
            <img src={`https://cdn.discordapp.com/avatars/${data.ID}/${data.Avatar}.png`} className='rounded-full' />
            <div className='self-center' style={{ color: `#${data.AccentColor?.toString(16)}` }}>
                <p className='text-2xl font-bold'>{data.Name}</p>
                <p className='text-gray-300'>@{data.Username}</p>
            </div>
        </div>
    );
}