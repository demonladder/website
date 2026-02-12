import { useQuery } from '@tanstack/react-query';
import { Heading2 } from '../../../../components/headings';
import LoadingSpinner from '../../../../components/shared/LoadingSpinner';
import { statsClient } from '../../../../api/stats';

export function Stats() {
    const queueStats = useQuery({
        queryKey: ['stats', 'queue'],
        queryFn: () => statsClient.getQueue(),
    });

    if (queueStats.isPending) return <LoadingSpinner />;

    const highestCount = queueStats.data?.distributionByTier.reduce(
        (highest, cur) => Math.max(highest, cur.TierCount),
        0,
    );

    return (
        <section className='col-span-1 round:rounded-xl border border-theme-outline p-4 bg-theme-800'>
            <Heading2 className='mb-2'>Queue distribution by tier</Heading2>
            {queueStats.isSuccess &&
                <ul className='grid gap-x-3' style={{ gridTemplateColumns: 'max-content max-content auto' }}>
                    <p>Tier</p>
                    <p className='text-end'>Pending</p>
                    <p></p>
                    {queueStats.data.distributionByTier.map((q) => (
                        <li className='grid grid-cols-subgrid col-span-3'>
                            <p>{q.Tier}</p>
                            <p className='text-end'>{q.TierCount}</p>
                            <p
                                className={'tier-' + q.Tier}
                                style={{ width: `${(q.TierCount / (highestCount ?? 1)) * 100}%` }}
                            ></p>
                        </li>
                    ))}
                </ul>
            }
        </section>
    );
}
