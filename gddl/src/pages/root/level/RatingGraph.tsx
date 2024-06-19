import { useQuery } from '@tanstack/react-query';
import GetSpread from '../../../api/level/submissions/GetSpread';

interface Props {
    levelID: number;
}

export default function RatingGraph({ levelID }: Props) {
    const { data } = useQuery({
        queryKey: ['level', levelID, 'submissions', 'spread'],
        queryFn: () => GetSpread(levelID),
    });

    if (data === undefined || data.rating.length <= 1) return;

    const ratingData = data.rating;
    const maxCount = ratingData.reduce((acc, cur) => acc + cur.Count, 0);

    return (
        <section className='mt-6'>
            <h2 className='text-3xl mb-1'>Rating spread</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Tier</th>
                        <th className='w-full'>Percentage</th>
                    </tr>
                    {ratingData.map((d) => (
                        <tr key={d.Rating}>
                            <td>
                                <p className='pe-2 whitespace-nowrap'>{`Tier ${d.Rating}`}</p>
                            </td>
                            <td className='flex items-center'>
                                <span className={'inline-block h-6 tier-' + d.Rating} style={{ width: `${d.Count / maxCount * 100}%` }} />
                                <span className='ms-4 text-white'>{d.Count} ({(d.Count / maxCount * 100).toFixed(2)}%)</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}