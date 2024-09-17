import { useQuery } from '@tanstack/react-query';
import GetPackLeaders from '../../../api/packs/requests/GetPackLeaders';
import { Leader } from '../../../api/packs/types/Leader';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import usePackLevels from '../../../hooks/api/usePackLevels';

function LeaderboardEntry({ data, highestScore }: { data: Leader, highestScore?: number }) {
    if (highestScore === undefined) return (<LoadingSpinner />);

    const width = data.Sum * 100 / highestScore;
    const pfp = `https://cdn.discordapp.com/avatars/${data?.DiscordID}/${data?.Avatar}.png`;

    const profileColor = parseInt(''+data.AccentColor) || 0;

    const red = profileColor >> 16;
    const green = (profileColor >> 8) & 0xff;
    const blue = profileColor & 0xff;

    const brightness = 255 - Math.sqrt(0.299 * red ** 2 + 0.587 * green ** 2 + 0.114 * blue ** 2);
    const textCol = brightness < 128 ? 0 : 255;

    return (
        <div className='mt-[2px] max-md:text-xs'>
            <Link to={`/profile/${data.UserID}`} style={{ width: width + '%', backgroundColor: `#${profileColor.toString(16)}` }} className='inline-block relative h-10 bg-gray-500'>
                {data.Avatar &&
                    <object data={pfp} type='image/png' className='rounded-full w-10 -ms-12' />
                }
                <span className='absolute right-2 top-1/2 -translate-y-1/2 overflow-hidden' style={{ color: `rgb(${textCol}, ${textCol}, ${textCol})` }}>{data.Name}</span>
                <span className='absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full'>{data.Sum}%</span>
            </Link>
        </div>
    );
}

export default function Leaderboard({ packID }: { packID?: number }) {
    const { data: packLeaders, isLoading, isFetching } = useQuery({
        queryKey: ['packLeaders', packID],
        queryFn: () => GetPackLeaders(packID),
    });

    const { data: levels } = usePackLevels(packID);

    const highestScore = ((levels?.length ?? 0) * 100) || packLeaders?.leaderboard?.reduce((prev, curr) => {
        if (prev < curr.Sum) return curr.Sum;
        return prev;
    }, packLeaders.leaderboard[0].Sum);

    return (
        <section className='mt-4'>
            <h2 className='text-3xl'>Leaderboard</h2>
            <p>The current top 25:</p>
            <LoadingSpinner isLoading={isLoading || isFetching} />
            <div className='pe-8'>
                {packLeaders?.leaderboard?.map((contestant) => (<LeaderboardEntry data={contestant} highestScore={highestScore} key={'leader_' + contestant.UserID} />))}
            </div>
            {packLeaders?.aroundYou &&
                <div className='mt-4'>
                    <h2 className='text-2xl'>Around you</h2>
                    <div className='pe-8'>
                        {packLeaders?.aroundYou?.map((contestant) => (<LeaderboardEntry data={contestant} highestScore={highestScore} key={'leader_' + contestant.UserID} />))}
                    </div>
                </div>
            }
        </section>
    );
}