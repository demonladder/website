import { useQuery } from '@tanstack/react-query';
import GetSpread from '../../../api/level/requests/submissions/GetSpread';

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
        <section className='mt-4'>
            <h2 className='text-3xl mb-1'>Rating spread</h2>
            <div className='grid gap-2' style={{ gridTemplateColumns: '1fr 17fr' }}>
                {ratingData.map((d) => (
                    <>
                        <p>{`Tier ${d.Rating}`}</p>
                        <div className={'relative tier-' + d.Rating} style={{ width: `${d.Count / maxCount * 100}%`, height: '100%' }}>
                            <span className='absolute left-full translate-x-2 text-white w-max'>{d.Count} ({(d.Count / maxCount * 100).toFixed(2)}%)</span>
                        </div>
                    </>
                ))}
            </div>
        </section>
    );
}