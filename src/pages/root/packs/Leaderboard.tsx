import { useQuery } from '@tanstack/react-query';
import GetPackLeaders from '../../../api/packs/requests/GetPackLeaders';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import usePackLevels from '../../../hooks/api/usePackLevels';
import DiscordUserData from '../../../api/types/DiscordUserData';
import User from '../../../api/types/User';

function LeaderboardEntry({ sum, discordData, user, highestScore }: { sum: number, user: User, discordData: DiscordUserData, highestScore?: number }) {
    if (highestScore === undefined) return (<LoadingSpinner />);

    const width = sum * 100 / highestScore;
    const pfp = `https://cdn.discordapp.com/avatars/${discordData?.ID}/${discordData?.Avatar}.png`;

    const profileColor = discordData.AccentColor ? parseInt(discordData.AccentColor) : 0;

    const red = profileColor >> 16;
    const green = (profileColor >> 8) & 0xff;
    const blue = profileColor & 0xff;

    const brightness = 255 - Math.sqrt(0.299 * red ** 2 + 0.587 * green ** 2 + 0.114 * blue ** 2);
    const textCol = brightness < 128 ? 0 : 255;

    return (
        <div className='mt-[2px] max-md:text-xs'>
            <Link to={`/profile/${user.ID}`} style={{ width: width + '%', backgroundColor: `#${profileColor.toString(16)}` }} className='inline-block relative h-10 bg-gray-500 round:rounded-xl'>
                {discordData.Avatar &&
                    <object data={pfp} type='image/png' className='rounded-full w-10 -ms-12' />
                }
                <span className='absolute right-2 top-1/2 -translate-y-1/2 overflow-hidden' style={{ color: `rgb(${textCol}, ${textCol}, ${textCol})` }}>{user.Name}</span>
                <span className='absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full'>{sum}%</span>
            </Link>
        </div>
    );
}

export default function Leaderboard({ packID }: { packID?: number }) {
    const { data: packLeaders, status } = useQuery({
        queryKey: ['packLeaders', packID],
        queryFn: () => GetPackLeaders(packID),
    });

    const { data: levels } = usePackLevels(packID);

    const highestScore = ((levels?.length ?? 0) * 100) || packLeaders?.reduce((prev, curr) => {
        if (prev < curr.Sum) return curr.Sum;
        return prev;
    }, packLeaders[0].Sum);

    return (
        <section className='mt-4'>
            <h2 className='text-3xl'>Leaderboard</h2>
            <p>The current top 25:</p>
            <LoadingSpinner isLoading={status === 'loading'} />
            {status === 'error' && <p>Error: could not fetch leaderboard from server</p>}
            <div className='pe-8'>
                {packLeaders?.map((contestant) => (<LeaderboardEntry user={contestant.User} sum={contestant.Sum} discordData={contestant.User.DiscordData} highestScore={highestScore} key={'leader_' + contestant.UserID} />))}
            </div>
            {/* {packLeaders?.aroundYou &&
                <div className='mt-4'>
                    <h2 className='text-2xl'>Around you</h2>
                    <div className='pe-8'>
                        {packLeaders?.aroundYou?.map((contestant) => (<LeaderboardEntry data={contestant} highestScore={highestScore} key={'leader_' + contestant.UserID} />))}
                    </div>
                </div>
            } */}
        </section>
    );
}
