import { useQuery } from '@tanstack/react-query';
import { GetStats } from '../../api/stats';
import UserLink from '../../components/UserLink';
import FloatingLoadingSpinner from '../../components/FloatingLoadingSpinner';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StatisticTracker({ value, label }: { value: number|undefined, label: string }) {
    return (
        <div className='relative p-3 bg-gray-600 round:rounded-2xl flex gap-4'>
            <FloatingLoadingSpinner isLoading={value === undefined} />
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
    });

    const levelSearches: ChartData<'line'> = {
        labels: stats?.DataLogs.map((_n, i) => (i+1)*5 + ' min'),
        datasets: [
            {
                label: 'Level searches in the last hour',
                data: stats?.DataLogs.map((stat) => stat.levelSearches) || [],
                borderColor: '#ffffff90',
                pointBorderColor: '#00000000',
                pointBackgroundColor: '#ffffff',
                tension: 0.2,
            },
        ],
    };

    const submissions: ChartData<'line'> = {
        labels: stats?.DataLogs.map((_n, i) => (i+1)*5 + ' min'),
        datasets: [
            {
                label: 'Site submissions in the last hour',
                data: stats?.DataLogs.map((stat) => stat.ratingsSubmitted) || [],
                borderColor: '#00ff0090',
                pointBorderColor: '#00000000',
                pointBackgroundColor: '#00ff00',
                tension: 0.2,
            },
            {
                label: 'Starbot submissions in the last hour',
                data: stats?.DataLogs.map((stat) => stat.starbotRatingsSubmitted) || [],
                borderColor: '#ffef0190',
                pointBorderColor: '#00000000',
                pointBackgroundColor: '#ffef01',
                tension: 0.2,
            },
        ],
    };

    return (
        <div>
            <h3 className='text-2xl mb-3'>Overview</h3>
            <p className='mb-8'>What should I even write here?</p>
            <p className='mb-1'>Have some statistics ig. Total submissions is now excluding the user, <UserLink userID={872} />.</p>
            <div className='grid gap-4 grid-cols-1 lg:grid-cols-3 mb-4'>
                <StatisticTracker value={stats?.PendingSubmissions} label='Pending submissions' />
                <StatisticTracker value={stats?.Submissions} label='Submissions' />
                <StatisticTracker value={stats?.Users} label='Users' />
            </div>
            <Line data={levelSearches} />
            <br />
            <Line data={submissions} />
        </div>
    );
}