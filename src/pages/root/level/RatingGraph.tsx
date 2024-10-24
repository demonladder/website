import { useQuery } from '@tanstack/react-query';
import GetSpread from '../../../api/level/submissions/GetSpread';
import TwoPlayerButtons from './TwoPlayerButtons';
import LevelMeta from '../../../api/types/LevelMeta';

interface Props {
    levelMeta: LevelMeta;
    twoPlayer: boolean;
    setShowTwoPlayerStats: (show: boolean) => void;
}

export default function RatingGraph({ levelMeta, twoPlayer, setShowTwoPlayerStats }: Props) {
    const { data } = useQuery({
        queryKey: ['level', levelMeta.ID, 'submissions', 'spread'],
        queryFn: () => GetSpread(levelMeta.ID),
    });

    if (data === undefined) return;

    const ratingData = (twoPlayer ? data.twoPlayerRating : data.rating);
    const enjoymentData = (twoPlayer ? data.twoPlayerEnjoyment : data.enjoyment);

    const maxCount = ratingData.reduce((acc, cur) => acc + cur.Count, 0);
    const maxEnjoymentCount = enjoymentData.reduce((acc, cur) => acc + cur.Count, 0);

    return (
        <section className='mt-6'>
            {ratingData.length > 0 &&
                <>
                    <h2 className='text-3xl mb-1'>Rating spread</h2>
                    <TwoPlayerButtons levelMeta={levelMeta} showTwoPlayerStats={twoPlayer} setShowTwoPlayerStats={setShowTwoPlayerStats} />
                    <table>
                        <tbody>
                            <tr>
                                <th></th>
                                <th className='w-full'></th>
                            </tr>
                            {ratingData.map((d) => (
                                <tr key={d.Rating}>
                                    <td>
                                        <p className='pe-2 whitespace-nowrap'>{`Tier ${d.Rating}`}</p>
                                    </td>
                                    <td className='flex items-center'>
                                        <span className={`inline-block h-6 tier-${d.Rating}`} style={{ width: `${d.Count / maxCount * 100}%` }} />
                                        <span className='ms-4 text-white'>{d.Count} ({(d.Count / maxCount * 100).toFixed(2)}%)</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            }
            <h2 className='text-3xl mt-6 mb-1'>Enjoyment spread</h2>
            <TwoPlayerButtons levelMeta={levelMeta} showTwoPlayerStats={twoPlayer} setShowTwoPlayerStats={setShowTwoPlayerStats} />
            <table className='mt-2'>
                <tbody>
                    <tr>
                        <th></th>
                        <th className='w-full'></th>
                    </tr>
                    {enjoymentData.map((d) => (
                        <tr key={d.Enjoyment}>
                            <td>
                                <p className='pe-2 whitespace-nowrap text-center'>{`${d.Enjoyment}`}/10</p>
                            </td>
                            <td className='flex items-center'>
                                <span className={`inline-block h-6 enj-${d.Enjoyment}`} style={{ width: `${d.Count / maxEnjoymentCount * 100}%` }} />
                                <span className='ms-4 text-white'>{d.Count} ({(d.Count / maxEnjoymentCount * 100).toFixed(2)}%)</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}