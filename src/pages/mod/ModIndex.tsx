import { useQuery } from '@tanstack/react-query';
import GetStats from '../../api/stats/GetStats';
import GetHealthStats from '../../api/stats/GetHealthStats';
import FloatingLoadingSpinner from '../../components/FloatingLoadingSpinner';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import StaffLeaderboard from './StaffLeaderboard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StatisticTracker({ value, label }: { value?: number, label: string }) {
    return (
        <div className='relative p-3 bg-theme-600 round:rounded-2xl flex gap-4'>
            <FloatingLoadingSpinner isLoading={value === undefined} />
            <i className='bx bx-spreadsheet text-4xl bg-theme-500 round:rounded-lg p-4'></i>
            <div className='self-center'>
                <b className='text-xl'>{value ?? '-'}</b>
                <p>{label}</p>
            </div>
        </div>
    );
}

export default function ModIndex() {
    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: GetStats,
    });
    const { data: logCounts } = useQuery({
        queryKey: ['stats', 'health'],
        queryFn: GetHealthStats,
    });

    return (
        <div>
            <h3 className='text-2xl mb-3'>Overview</h3>
            <div className='grid gap-4 grid-cols-1 lg:grid-cols-3 mb-4'>
                <StatisticTracker value={stats?.pendingSubmissions} label='Pending submissions' />
                <StatisticTracker value={stats?.submissions} label='Submissions' />
                <StatisticTracker value={stats?.users} label='Users' />
                <StatisticTracker value={logCounts?.warns} label='Warnings in the past 24h' />
                <StatisticTracker value={logCounts?.errors} label='Errors in the past 24h' />
            </div>
            <StaffLeaderboard />
        </div>
    );
}
