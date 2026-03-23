import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { Heading2 } from '../../../components/headings';
import { getUserRankings } from '../api/getUserRankings';
import { useParams } from 'react-router';

const MAX_TIER = parseInt(import.meta.env.VITE_MAX_TIER);

const RANKS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'S'];

function percentToRank(percent: number): string {
    if (percent === 0) return '0';
    if (percent >= 100) return 'S';
    return RANKS[Math.floor(percent / 10)];
}

function Rank({ tier, count, total }: { tier?: string; count: number; total: number }) {
    const percent = (count / total) * 100;

    return (
        <tr className='odd:bg-theme-700 flex py-1'>
            <td className='whitespace-nowrap w-24'>
                <p className='px-2 py-1'>
                    <b>{tier !== undefined ? `Tier ${tier}` : 'Overall'}</b>
                </p>
            </td>
            <td className='px-2 whitespace-nowrap w-10 self-center text-center mx-4'>
                <b>{percentToRank(percent)}</b>
            </td>
            <td className='px-2 whitespace-nowrap w-20 self-center mx-2'>{percent.toFixed(2)}%</td>
            <td className='px-2 whitespace-nowrap w-24 self-center mx-2'>
                {count}/{total}
            </td>
            <td className=' ps-2 pe-1 grow'>
                <span className='block relative'>
                    <span
                        className={`absolute block left-0 top-0 align-middle h-9 tier-${tier ?? Math.min(Math.floor(0.36 * percent + 1), MAX_TIER)}`}
                        style={{ width: `${percent}%` }}
                    />
                </span>
            </td>
        </tr>
    );
}

export default function RankingsWrapper() {
    const userID = useParams().userID ?? '';
    const parsed = parseInt(userID);

    if (isNaN(parsed)) return;

    return <Rankings userID={parsed} />;
}

function Rankings({ userID }: { userID: number }) {
    const { data } = useQuery({
        queryKey: ['user', userID, 'rankings'],
        queryFn: () => getUserRankings(userID),
    });

    return (
        <section className='mt-6'>
            <Heading2 id='rankings'>Rankings</Heading2>
            <table className='gap-2 my-2 text-sm md:text-xl block'>
                <tbody className='block'>
                    {data === undefined ? (
                        <tr>
                            <td>
                                <LoadingSpinner />
                            </td>
                        </tr>
                    ) : (
                        <>
                            <Rank
                                count={Object.values(data).reduce((acc, cur) => acc + cur.Count, 0)}
                                total={Object.values(data).reduce((acc, cur) => acc + cur.Total, 0)}
                            />
                            {Object.keys(data).map((key) => (
                                <Rank tier={key} count={data[key].Count} total={data[key].Total} key={key} />
                            ))}
                        </>
                    )}
                </tbody>
            </table>
        </section>
    );
}
