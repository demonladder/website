import { useQuery } from '@tanstack/react-query';
import { getGlobalPackLeaders } from '../api/getGlobalPackLeaders';
import LoadingSpinner from '../../../components/LoadingSpinner';
import usePackLevels from '../../singlePack/hooks/usePackLevels';
import Heading2 from '../../../components/headings/Heading2';
import { LeaderboardEntry } from './LeaderboardEntry';

export default function Leaderboard({ packID }: { packID?: number }) {
    const { data: packLeaders, status } = useQuery({
        queryKey: ['pack', packID, 'leaders'],
        queryFn: () => getGlobalPackLeaders(packID),
    });

    const { data: levels } = usePackLevels(packID);

    const highestScore = ((levels?.length ?? 0) * 100) || packLeaders?.reduce((prev, curr) => {
        if (prev < curr.Sum) return curr.Sum;
        return prev;
    }, packLeaders[0].Sum);

    return (
        <section className='mt-4'>
            <Heading2>Global Leaderboard</Heading2>
            <LoadingSpinner isLoading={status === 'pending'} />
            {status === 'error' && <p>Error: could not fetch leaderboard from server</p>}
            <div className='pe-8'>
                {packLeaders?.map((contestant) => (<LeaderboardEntry user={contestant.User} userID={contestant.UserID} sum={contestant.Sum} discordData={contestant.User.DiscordData} highestScore={highestScore} key={'leader_' + contestant.UserID} />))}
            </div>
        </section>
    );
}
