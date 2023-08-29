import { useQuery } from '@tanstack/react-query';
import { GetStats } from '../../api/stats';
import UserLink from '../../components/UserLink';

function StatisticTracker({ value, label }: { value: number|undefined, label: string }) {
    return (
        <div className='p-3 bg-gray-600 round:rounded-2xl flex gap-4'>
            <i className='bx bx-spreadsheet text-4xl bg-gray-500 round:rounded-lg p-4'></i>
            <div className='self-center'>
                <b className='text-xl'>
                    {value !== undefined
                        ? value
                        : '-'
                    }
                </b>
                <p>{label}</p>
            </div>
        </div>
    );
}

export default function ModIndex() {
    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: GetStats,
    })

    return (
        <div>
            <h3 className='text-2xl mb-3'>Overview</h3>
            <p className='mb-8'>What should I even write here?</p>
            <p className='mb-1'>Have some statistics ig. Total submissions is now excluding the user, <UserLink userID={872} />.</p>
            <div className='grid gap-4 grid-cols-1 lg:grid-cols-3'>
                <StatisticTracker value={stats?.PendingSubmissions} label='Pending submissions' />
                <StatisticTracker value={stats?.Submissions} label='Submissions' />
                <StatisticTracker value={stats?.Users} label='Users' />
            </div>
        </div>
    );
}