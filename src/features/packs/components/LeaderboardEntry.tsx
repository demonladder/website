import { Link } from 'react-router';
import DiscordUserData from '../../../api/types/DiscordUserData';
import User from '../../../api/types/User';
import LoadingSpinner from '../../../components/LoadingSpinner';

export function LeaderboardEntry({ sum, discordData, user, highestScore }: { sum: number; user: User; discordData: DiscordUserData | null; highestScore?: number; }) {
    if (highestScore === undefined) return (<LoadingSpinner />);

    const width = sum * 100 / highestScore;
    const pfp = `https://cdn.discordapp.com/avatars/${discordData?.ID}/${discordData?.Avatar}.png`;

    const profileColor = discordData?.AccentColor ? parseInt(discordData.AccentColor) : 0;

    const red = profileColor >> 16;
    const green = (profileColor >> 8) & 0xff;
    const blue = profileColor & 0xff;

    const brightness = 255 - Math.sqrt(0.299 * red ** 2 + 0.587 * green ** 2 + 0.114 * blue ** 2);
    const textCol = brightness < 128 ? 'black' : 'white';

    return (
        <div className='mt-2 max-md:text-xs grid grid-cols-[auto_1fr_auto] gap-2'>
            <object data={pfp} type='image/png' className='rounded-full size-10' />
            <Link to={`/profile/${user.ID}`} style={{ width: width + '%', backgroundColor: `#${profileColor.toString(16)}` }} className='flex items-center ps-2 relative h-10 bg-gray-500 round:rounded-xl'>
                <span style={{ color: textCol }}>{user.Name}</span>
                <span className='absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full'>{sum}%</span>
            </Link>
            <span className='opacity-0'>{sum}%</span>
        </div>
    );
}
