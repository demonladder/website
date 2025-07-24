import TwoPlayerButtons from './TwoPlayerButtons';
import LevelMeta from '../types/LevelMeta';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useLevelSubmissionSpread } from '../../../hooks/api/level/submissions/useLevelSubmissionSpread';
import { useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Heading2 from '../../../components/headings/Heading2';

interface Props {
    levelMeta: LevelMeta;
    twoPlayer: boolean;
    setShowTwoPlayerStats: (show: boolean) => void;
}

export default function RatingGraph({ levelMeta, twoPlayer, setShowTwoPlayerStats }: Props) {
    const { ref, inView } = useInView();
    const { data, status } = useLevelSubmissionSpread(levelMeta.ID, inView);
    const [showPercentages, setShowPercentages] = useState(false);

    const ratingData = twoPlayer ? data?.twoPlayerRating : data?.rating;
    const totalRatings = ratingData?.reduce((acc, cur) => acc + cur.Count, 0) ?? 1;
    const maxRatingCount = ratingData?.reduce((acc, cur) => Math.max(acc, cur.Count), 0) ?? 1;

    // Fill the gaps in the rating data
    const filledRatingData = useMemo(() => {
        if (!ratingData) return [];
        const lowestRating = ratingData.reduce((acc, cur) => Math.min(acc, cur.Rating), ratingData.at(0)?.Rating ?? 1);
        const highestRating = ratingData.reduce((acc, cur) => Math.max(acc, cur.Rating), ratingData.at(0)?.Rating ?? 35);

        const filledData = [...ratingData];
        for (let i = lowestRating; i <= highestRating; i++) {
            if (!ratingData.find((d) => d.Rating === i)) {
                filledData.push({ Rating: i, Count: 0 });
            }
        }
        return filledData.sort((a, b) => a.Rating - b.Rating);
    }, [ratingData]);

    const enjoymentData = twoPlayer ? data?.twoPlayerEnjoyment : data?.enjoyment;
    const totalEnjoyments = enjoymentData?.reduce((acc, cur) => acc + cur.Count, 0) ?? 1;
    const maxEnjoymentCount = enjoymentData?.reduce((acc, cur) => Math.max(acc, cur.Count), 0) ?? 1;

    const filledEnjoymentData = useMemo(() => {
        if (!enjoymentData) return [];
        const lowestEnjoyment = enjoymentData.reduce((acc, cur) => Math.min(acc, cur.Enjoyment), enjoymentData.at(0)?.Enjoyment ?? 0);
        const highestEnjoyment = enjoymentData.reduce((acc, cur) => Math.max(acc, cur.Enjoyment), enjoymentData.at(0)?.Enjoyment ?? 10);

        const filledData = [...enjoymentData];
        for (let i = lowestEnjoyment; i <= highestEnjoyment; i++) {
            if (!enjoymentData.find((d) => d.Enjoyment === i)) {
                filledData.push({ Enjoyment: i, Count: 0 });
            }
        }
        return filledData.sort((a, b) => a.Enjoyment - b.Enjoyment);
    }, [enjoymentData]);

    return (
        <section className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 border-gray-500 border-y py-6' ref={ref}>
            {status === 'pending' && <LoadingSpinner />}
            {status === 'success' &&
                <div>
                    <Heading2>Rating spread</Heading2>
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
            {(enjoymentData ?? []).length > 0 &&
                <div>
                    <Heading2>Enjoyment spread</Heading2>
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
