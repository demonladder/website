import { useQuery } from '@tanstack/react-query';
import { GetPackLeaders, Leader } from '../../../api/packs';
import StorageManager from '../../../utils/storageManager';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Link } from 'react-router-dom';

function Contestant({ data, leader }: { data: Leader, leader: Leader | undefined }) {
    if (leader === undefined) return (<LoadingSpinner />);

    const width = data.Sum * 100 / leader.Sum;
    const pfp = `https://cdn.discordapp.com/avatars/${data?.DiscordID}/${data?.Avatar}.png`;

    return (
        <div className='mt-[2px] max-md:text-xs'>
            <Link to={`/profile/${data.UserID}`} style={{ width: width + '%', backgroundColor: `#${data.AccentColor?.toString(16)}` }} className='inline-block relative h-10 bg-gray-500'>
                {data.Avatar &&
                    <img src={pfp} className='rounded-full w-10 -ms-12'/>
                }
                <span className='absolute right-2 top-1/2 -translate-y-1/2'>{data.Name}</span>
                <span className='absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full'>{data.Sum}%</span>
            </Link>
        </div>
    );
}

export default function Leaderboard() {
    const { data: packLeaders, isLoading, isFetching } = useQuery({
        queryKey: ['packLeaders'],
        queryFn: GetPackLeaders,
        enabled: StorageManager.getUseExperimental(),
    });

    if (!StorageManager.getUseExperimental()) return;

    const sorted = packLeaders?.sort((a, b) => ((a.Sum < b.Sum) ? 1 : -1));
    const leader = sorted?.[0];

    return (
        <section className='mt-4'>
            <h2 className='text-3xl'>Leaderboard</h2>
            <LoadingSpinner isLoading={isLoading || isFetching} />
            <div className='pe-8'>
                {sorted && sorted.map((contestant) => (<Contestant data={contestant} leader={leader} key={'leader_' + contestant.UserID} />))}
            </div>
        </section>
    );
}