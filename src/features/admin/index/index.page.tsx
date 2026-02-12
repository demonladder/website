import { useQuery } from '@tanstack/react-query';
import { getStats } from '../../home/api/getStats';
import FloatingLoadingSpinner from '../../../components/ui/FloatingLoadingSpinner';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import StaffLeaderboard from './components/StaffLeaderboard';
import Showcases from './components/Showcases';
import { Heading1 } from '../../../components/headings';
import { truncateBigNumber } from '../../../utils/truncateBigNumber';
import { useState } from 'react';
import { Stats } from './components/Stats';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StatisticTracker({ value, oldValue, label }: { label: string, oldValue?: number, value?: number }) {
    const [changeDisplayMode, setChangeDisplayMode] = useState<'absolute' | 'percentage'>('absolute');

    const absoluteChange = oldValue !== undefined && value !== undefined ? value - oldValue : undefined;
    const absoluteChangeText = absoluteChange !== undefined ? `${absoluteChange >= 0 ? '+' : ''}${absoluteChange}` : undefined;
    const percentageChange = oldValue !== undefined && absoluteChange !== undefined && oldValue !== 0 ? (absoluteChange / oldValue) * 100 : undefined;
    const percentageChangeText = percentageChange !== undefined ? `${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}%` : undefined;

    const change = changeDisplayMode === 'absolute' ? absoluteChangeText : percentageChangeText;

    return (
        <div onClick={() => setChangeDisplayMode(changeDisplayMode === 'absolute' ? 'percentage' : 'absolute')} className='relative cursor-pointer p-4 bg-theme-800 round:rounded-2xl gap-4 border border-theme-600 overflow-hidden'>
            <FloatingLoadingSpinner isLoading={value === undefined} />
            <p className='text-theme-400 text-sm mb-1'>{label}</p>
            <div className='flex justify-between items-end'>
                <p className='text-2xl'>{value !== undefined ? truncateBigNumber(value) : '-'} </p>
                {change !== undefined && <p className='text-base'>
                    <svg className='inline-block me-1' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: 'currentColor', transform: '', msFilter: '' }}><path d="m10 10.414 4 4 5.707-5.707L22 11V5h-6l2.293 2.293L14 11.586l-4-4-7.707 7.707 1.414 1.414z"></path></svg>
                    {change}
                </p>}
            </div>
        </div>
    );
}

export default function ModIndex() {
    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: getStats,
    });

    return (
        <div>
            <Heading1 className='mb-3'>Dashboard</Heading1>
            <div className='grid gap-4 grid-cols-1 lg:grid-cols-4 mb-4'>
                <StatisticTracker value={stats?.submissions.now} oldValue={stats?.submissions.old} label='Total Submissions' />
                <StatisticTracker value={stats?.pendingSubmissions.now} oldValue={stats?.pendingSubmissions.old} label='Pending submissions' />
                <StatisticTracker value={stats?.users.now} oldValue={stats?.users.old} label='Total Users' />
                <StatisticTracker value={stats?.totalLevels.now} oldValue={stats?.totalLevels.old} label='Total Levels' />
            </div>
            <Showcases />
            <div className='mt-8 grid lg:grid-cols-2 gap-4'>
                <Stats />
                <StaffLeaderboard />
            </div>
        </div>
    );
}
