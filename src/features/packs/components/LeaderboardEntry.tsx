import { Link } from 'react-router';
import DiscordUserData from '../../../api/types/DiscordUserData';
import User from '../../../api/types/User';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';

export function LeaderboardEntry({ discordData, highestScore, sum, user, userID }: { sum: number, user: Pick<User, 'Name' | 'avatar'>, userID: number, discordData: Pick<DiscordUserData, 'AccentColor'> | null, highestScore?: number }) {
    if (highestScore === undefined) return (<LoadingSpinner />);

    const width = sum * 100 / highestScore;

    const profileColor = discordData?.AccentColor ? parseInt(discordData.AccentColor) : 0;

    const red = profileColor >> 16;
    const green = (profileColor >> 8) & 0xff;
    const blue = profileColor & 0xff;

    const brightness = 255 - Math.sqrt(0.299 * red ** 2 + 0.587 * green ** 2 + 0.114 * blue ** 2);
    const textCol = brightness < 128 ? 'black' : 'white';

    return (
        <div className='mt-2 max-md:text-xs grid grid-cols-[auto_1fr_auto] gap-2'>
            {user.avatar
                ? <img src={`https://cdn.gdladder.com/avatars/${userID}/${user.avatar}.png`} width='40' height='40' className='rounded-full size-10' alt='Profile' />
                : <i className='bx bxs-user-circle text-[40px]' style={{ color: `#${profileColor.toString(16)}` }} />
            }
            <Link to={`/profile/${userID}`} style={{ width: width + '%', backgroundColor: `#${profileColor.toString(16)}` }} className='flex items-center ps-2 relative h-10 bg-gray-500 round:rounded-xl'>
                <span style={{ color: textCol }}>{user.Name}</span>
                <span className='absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full'>{sum}%</span>
            </Link>
            <span className='opacity-0'>{sum}%</span>
        </div>
    );
}
