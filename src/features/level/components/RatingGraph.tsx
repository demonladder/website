import TwoPlayerButtons from './TwoPlayerButtons';
import LevelMeta from '../types/LevelMeta';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useLevelSubmissionSpread } from '../../../hooks/api/level/submissions/useLevelSubmissionSpread';
import { useState } from 'react';

interface Props {
    levelMeta: LevelMeta;
    twoPlayer: boolean;
    setShowTwoPlayerStats: (show: boolean) => void;
}

export default function RatingGraph({ levelMeta, twoPlayer, setShowTwoPlayerStats }: Props) {
    const { data, status } = useLevelSubmissionSpread(levelMeta.ID);
    const [showPercentages, setShowPercentages] = useState(false);

    if (status === 'loading' || status === 'error') return (
        <section className='mt-6'>
            <h2 className='text-3xl'>Rating spread</h2>
            <LoadingSpinner />
        </section>
    );

    const ratingData = twoPlayer ? data.twoPlayerRating : data.rating;
    const totalRatings = ratingData.reduce((acc, cur) => acc + cur.Count, 0);
    const maxRatingCount = ratingData.reduce((acc, cur) => Math.max(acc, cur.Count), 0);
    const lowestRating = ratingData.reduce((acc, cur) => Math.min(acc, cur.Rating), ratingData.at(0)?.Rating ?? 1);
    const highestRating = ratingData.reduce((acc, cur) => Math.max(acc, cur.Rating), ratingData.at(0)?.Rating ?? 35);

    // Fill the gaps in the rating data
    const filledRatingData = [...ratingData];
    for (let i = lowestRating; i <= highestRating; i++) {
        if (!ratingData.find((d) => d.Rating === i)) {
            filledRatingData.push({ Rating: i, Count: 0 });
        }
    }

    filledRatingData.sort((a, b) => a.Rating - b.Rating);

    const enjoymentData = twoPlayer ? data.twoPlayerEnjoyment : data.enjoyment;
    const totalEnjoyments = enjoymentData.reduce((acc, cur) => acc + cur.Count, 0);
    const maxEnjoymentCount = enjoymentData.reduce((acc, cur) => Math.max(acc, cur.Count), 0);
    const lowestEnjoyment = enjoymentData.reduce((acc, cur) => Math.min(acc, cur.Enjoyment), enjoymentData.at(0)?.Enjoyment ?? 0);
    const highestEnjoyment = enjoymentData.reduce((acc, cur) => Math.max(acc, cur.Enjoyment), enjoymentData.at(0)?.Enjoyment ?? 10);

    const filledEnjoymentData = [...enjoymentData];
    for (let i = lowestEnjoyment; i <= highestEnjoyment; i++) {
        if (!enjoymentData.find((d) => d.Enjoyment === i)) {
            filledEnjoymentData.push({ Enjoyment: i, Count: 0 });
        }
    }

    filledEnjoymentData.sort((a, b) => a.Enjoyment - b.Enjoyment);

    if (!ratingData.length && !enjoymentData.length) return;

    return (
        <section className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border-gray-500 border-y py-6'>
            {ratingData.length > 0 &&
                <div>
                    <h2 className='text-3xl mb-1'>Rating spread</h2>
                    <TwoPlayerButtons levelMeta={levelMeta} showTwoPlayerStats={twoPlayer} setShowTwoPlayerStats={setShowTwoPlayerStats} />
                    <table className='mt-2'>
                        <tbody>
                            <tr>
                                <th></th>
                                <th></th>
                                <th className='w-full'></th>
                            </tr>
                            {filledRatingData.map((d) => (
                                <tr key={d.Rating}>
                                    <td className='border-e pe-3'>
                                        <p className='pe-2 whitespace-nowrap text-center'>{d.Rating}</p>
                                    </td>
                                    <td className='ps-4 pe-2 text-right cursor-pointer select-none' onClick={() => setShowPercentages((prev) => !prev)}>
                                        <p>{showPercentages ? `${(d.Count / totalRatings * 100).toFixed(1)}%` : d.Count}</p>
                                    </td>
                                    <td className='flex items-center'>
                                        <span className={`inline-block h-6 tier-${d.Rating} rounded shadow`} style={{ width: `${d.Count / maxRatingCount * 100}%` }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
            {enjoymentData.length > 0 &&
                <div>
                    <h2 className='text-3xl mb-1'>Enjoyment spread</h2>
                    <TwoPlayerButtons levelMeta={levelMeta} showTwoPlayerStats={twoPlayer} setShowTwoPlayerStats={setShowTwoPlayerStats} />
                    <table className='mt-2'>
                        <tbody>
                            <tr>
                                <th></th>
                                <th></th>
                                <th className='w-full'></th>
                            </tr>
                            {filledEnjoymentData.map((d) => (
                                <tr key={d.Enjoyment}>
                                    <td className='border-e pe-3'>
                                        <p className='pe-2 whitespace-nowrap text-center'>{`${d.Enjoyment}`}</p>
                                    </td>
                                    <td className='ps-4 pe-2 text-right cursor-pointer select-none' onClick={() => setShowPercentages((prev) => !prev)}>
                                        <p>{showPercentages ? `${(d.Count / totalEnjoyments * 100).toFixed(1)}%` : d.Count}</p>
                                    </td>
                                    <td className='flex items-center'>
                                        <span className={`inline-block h-6 enj-${d.Enjoyment} rounded shadow`} style={{ width: `${d.Count / maxEnjoymentCount * 100}%` }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </section>
    );
}
