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

    const ratingData = twoPlayer ? data.twoPlayerRating : data.rating;
    const maxRatingCount = ratingData.reduce((acc, cur) => acc + cur.Count, 0);
    const lowestRating = ratingData.reduce((acc, cur) => Math.min(acc, cur.Rating), ratingData[0].Rating);
    const highestRating = ratingData.reduce((acc, cur) => Math.max(acc, cur.Rating), ratingData[0].Rating);

    // Fill the gaps in the rating data
    const filledRatingData = [...ratingData];
    for (let i = lowestRating; i <= highestRating; i++) {
        if (!ratingData.find((d) => d.Rating === i)) {
            filledRatingData.push({ Rating: i, Count: 0 });
        }
    }

    filledRatingData.sort((a, b) => a.Rating - b.Rating);

    const enjoymentData = (twoPlayer ? data.twoPlayerEnjoyment : data.enjoyment);
    const maxEnjoymentCount = enjoymentData.reduce((acc, cur) => acc + cur.Count, 0);

    return (
        <section className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border-gray-500 border-y py-6'>
            {ratingData.length > 0 &&
                <div>
                    <h2 className='text-3xl mb-1'>Rating spread</h2>
                    <TwoPlayerButtons levelMeta={levelMeta} showTwoPlayerStats={twoPlayer} setShowTwoPlayerStats={setShowTwoPlayerStats} />
                    <table>
                        <tbody>
                            <tr>
                                <th></th>
                                <th></th>
                                <th className='w-full'></th>
                            </tr>
                            {filledRatingData.map((d) => (
                                <tr key={d.Rating}>
                                    <td className='border-e pe-3'>
                                        <p className='pe-2 whitespace-nowrap'>{`Tier ${d.Rating}`}</p>
                                    </td>
                                    <td className='px-3 text-right'>
                                        <p>{d.Count}</p>
                                    </td>
                                    <td className='flex items-center'>
                                        <span className={`inline-block h-6 tier-${d.Rating} round:rounded`} style={{ width: `${d.Count / maxRatingCount * 100}%` }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
            <div>
                <h2 className='text-3xl'>Enjoyment spread</h2>
                <TwoPlayerButtons levelMeta={levelMeta} showTwoPlayerStats={twoPlayer} setShowTwoPlayerStats={setShowTwoPlayerStats} />
                <table className='mt-2'>
                    <tbody>
                        <tr>
                            <th></th>
                            <th></th>
                            <th className='w-full'></th>
                        </tr>
                        {enjoymentData.map((d) => (
                            <tr key={d.Enjoyment}>
                                <td className='border-e pe-3'>
                                    <p className='pe-2 whitespace-nowrap text-center'>{`${d.Enjoyment}`}/10</p>
                                </td>
                                <td className='px-3 text-right'>
                                    <p>{d.Count}</p>
                                </td>
                                <td className='flex items-center'>
                                    <span className={`inline-block h-6 enj-${d.Enjoyment} round:rounded`} style={{ width: `${d.Count / maxEnjoymentCount * 100}%` }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
