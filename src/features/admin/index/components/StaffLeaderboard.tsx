import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import type { StaffLeaderboardRecord } from '../../../../api/staffLeaderboard/GetStaffLeaderboard';
import pluralS from '../../../../utils/pluralS';
import GetStaffLeaderboard from '../../../../api/staffLeaderboard/GetStaffLeaderboard';
import Heading2 from '../../../../components/headings/Heading2';
import { pickRandom } from '../../../../utils/pickRandom';

function StaffLeaderboardEntry({ data, highestScore }: { data: StaffLeaderboardRecord, highestScore?: number }) {
    if (highestScore === undefined) return (<LoadingSpinner />);

    const width = data.Points * 100 / highestScore;
    const displayScore = `${data.Points.toFixed(1)}pt${pluralS(data.Points)}`;

    return (
        <tr>
            <td className='pe-4'>
                <p className='flex justify-between'>{data.User?.Name} <span className='opacity-0 inline-block'>{displayScore}</span></p>
            </td>
            <td className='w-full'>
                <div className='h-10 bg-theme-500 flex justify-end' style={{ width: `${width}%` }}>
                    <p className='self-center me-2'>{displayScore}</p>
                </div>
            </td>
        </tr>
    );
}

const noDataMessages = [
    'It\'s so empty here...',
    'No one has accepted anything yet...',
    'Be the first to accept a submission!',
];

export default function StaffLeaderboard() {
    const { data } = useQuery({
        queryKey: ['staffLeaderboard'],
        queryFn: GetStaffLeaderboard,
    });

    const [view, setView] = useState<'allTime' | 'monthly'>('monthly');
    const filteredData = view === 'allTime' ? data?.allTime : data?.monthly;

    return (
        <section className='mt-8'>
            <Heading2>Point leaderboard</Heading2>
            <p>You get more points the higher the tier of the level is</p>
            <p>Bonus points for proof (Remember to check it)</p>
            <p>Points are also awarded for denied submissions so no mindlessly approving submissions</p>
            <div className='my-2 p-1 bg-theme-800/60 rounded-md inline-block'>
                <button className={'px-4 py-1 me-1 rounded-md ' + (view === 'monthly' ? 'bg-theme-500 hover:bg-theme-500/80' : 'hover:bg-theme-900/40')} onClick={() => setView('monthly')}>Monthly</button>
                <button className={'px-4 py-1 rounded-md ' + (view === 'allTime' ? 'bg-theme-500 hover:bg-theme-500/80' : 'hover:bg-theme-900/40')} onClick={() => setView('allTime')}>All time</button>
            </div>
            {filteredData?.length === 0 && <p>{pickRandom(noDataMessages)}</p>}
            <table className='mt-2 pe-8'>
                <Leaderboard data={filteredData} />
            </table>
        </section>
    );
}

function Leaderboard({ data }: { data?: StaffLeaderboardRecord[] }) {
    if (data === undefined) return (<LoadingSpinner />);

    const highestScore = data.reduce((prev, cur) => Math.max(prev, cur.Points), 0);

    return (
        <tbody>
            {data.map((contestant) => (<StaffLeaderboardEntry data={contestant} highestScore={highestScore} key={`leader_${contestant.UserID}`} />))}
        </tbody>
    );
}
