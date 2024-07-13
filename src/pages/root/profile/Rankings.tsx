import { useQuery } from '@tanstack/react-query';
import APIClient from '../../../api/APIClient';
import LoadingSpinner from '../../../components/LoadingSpinner';
import NewLabel from '../../../components/NewLabel';

interface Props {
    userID: number;
}

interface UserRanking {
    Count: number;
    Total: number;
}

async function GetUserRankings(userID: number): Promise<Record<string | 'Overall', UserRanking>> {
    return (await APIClient.get(`/user/${userID}/rank`)).data;
}

function percentToRank(percent: number): string {
    if (percent >= 100) return 'S';
    if (percent >= 90) return 'X';
    if (percent >= 80) return 'IX';
    if (percent >= 70) return 'VIII';
    if (percent >= 60) return 'VII';
    if (percent >= 50) return 'VI';
    if (percent >= 40) return 'V';
    if (percent >= 30) return 'IV';
    if (percent >= 20) return 'III';
    if (percent >= 10) return 'II';
    if (percent > 0) return 'I';
    return '0';
}

function Rank({ tier, count, total }: { tier?: string, count: number, total: number }) {
    const percent = (count / total * 100);

    return (
        <tr className='odd:bg-gray-700 flex py-1'>
            <td className='whitespace-nowrap w-24'><p className='px-2 py-1'><b>{tier !== undefined ? `Tier ${tier}` : 'Overall'}</b></p></td>
            <td className='px-2 whitespace-nowrap w-10 self-center text-center mx-4'><b>{percentToRank(percent)}</b></td>
            <td className='px-2 whitespace-nowrap w-20 self-center mx-2'>{percent.toFixed(2)}%</td>
            <td className='px-2 whitespace-nowrap w-24 self-center mx-2'>{count}/{total}</td>
            <td className='px-2 grow'>
                <span className='block relative'>
                    <span className={`absolute block left-0 top-0 align-middle h-9 tier-${tier ?? Math.min(Math.floor(0.36 * percent + 1), 35)}`} style={{ width: `${percent}%` }} />
                </span>
            </td>
        </tr>
    );
}

export default function Rankings({ userID }: Props) {
    const { data } = useQuery({
        queryKey: ['user', userID, 'rankings'],
        queryFn: () => GetUserRankings(userID),
    });

    return (
        <section>
            <h2 className='text-3xl mt-6' id='rankings'>Rankings <NewLabel ID='rankings' /></h2>
            <table className='gap-2 my-2 text-xl block'>
                <tbody className='block'>
                    {data === undefined
                        ? (<tr><td><LoadingSpinner /></td></tr>)
                        : <>
                            <Rank count={Object.values(data).reduce((acc, cur) => acc + cur.Count, 0)} total={Object.values(data).reduce((acc, cur) => acc + cur.Total, 0)} />
                            {Object.keys(data).map((key) => (<Rank tier={key} count={data[key].Count} total={data[key].Total} key={key} />))}
                        </>
                    }
                </tbody>
            </table>
        </section>
    );
}