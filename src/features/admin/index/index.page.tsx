import { useQuery } from '@tanstack/react-query';
import { statsClient } from '../../../api';
import FloatingLoadingSpinner from '../../../components/ui/FloatingLoadingSpinner';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import StaffLeaderboard from './components/StaffLeaderboard';
import Showcases from './components/Showcases';
import { Heading1 } from '../../../components/headings';
import { truncateBigNumber } from '../../../utils/truncateBigNumber';
import { useState } from 'react';
import { Stats } from './components/Stats';
import { Minus, TrendingDown, TrendingUp } from '@boxicons/react';
import Surface from '../../../components/layout/Surface';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StatisticTracker({
    value,
    oldValue,
    label,
    moreIsBetter = true,
}: {
    label: string;
    oldValue?: number | null;
    value?: number;
    moreIsBetter?: boolean;
}) {
    const [changeDisplayMode, setChangeDisplayMode] = useState<'absolute' | 'percentage'>('absolute');

    const absoluteChange = value !== undefined ? value - (oldValue ?? value) : undefined;
    const absoluteChangeText =
        absoluteChange !== undefined
            ? `${absoluteChange >= 0 ? '+' : ''}${absoluteChange.toLocaleString()}`
            : undefined;
    const percentageChange = ((absoluteChange ?? 0) / (oldValue ?? 1)) * 100;
    const percentageChangeText =
        percentageChange !== undefined
            ? `${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}%`
            : undefined;

    const change = changeDisplayMode === 'absolute' ? absoluteChangeText : percentageChangeText;

    const isPositiveChange = absoluteChange !== undefined ? absoluteChange > 0 : true;
    const isNoChange = absoluteChange === 0;
    const trendColor = isNoChange
        ? ''
        : isPositiveChange && moreIsBetter
          ? 'text-green-500'
          : !isPositiveChange && !moreIsBetter
            ? 'text-green-500'
            : 'text-red-500';

    return (
        <Surface
            variant='800'
            onClick={() => setChangeDisplayMode(changeDisplayMode === 'absolute' ? 'percentage' : 'absolute')}
            className='relative cursor-pointer'
        >
            <FloatingLoadingSpinner isLoading={value === undefined} />
            <p className='text-theme-400 text-sm mb-1'>{label}</p>
            <div className={`flex justify-between items-end ${trendColor}`}>
                <p className='text-2xl'>{value !== undefined ? truncateBigNumber(value) : '-'} </p>
                {change !== undefined && (
                    <p className='flex items-center gap-1'>
                        {isNoChange ? <Minus /> : isPositiveChange ? <TrendingUp /> : <TrendingDown />}
                        {change}
                    </p>
                )}
            </div>
        </Surface>
    );
}

export default function ModIndex() {
    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: () => statsClient.getStats(),
    });

    return (
        <div>
            <Heading1 className='mb-3'>Dashboard</Heading1>
            <div className='grid gap-4 grid-cols-1 lg:grid-cols-4 mb-4'>
                <StatisticTracker
                    value={stats?.submissions.now}
                    oldValue={stats?.submissions.old}
                    label='Total Submissions'
                />
                <StatisticTracker
                    value={stats?.pendingSubmissions.now}
                    oldValue={stats?.pendingSubmissions.old}
                    label='Pending submissions'
                    moreIsBetter={false}
                />
                <StatisticTracker value={stats?.users.now} oldValue={stats?.users.old} label='Total Users' />
                <StatisticTracker
                    value={stats?.totalLevels.now}
                    oldValue={stats?.totalLevels.old}
                    label='Total Levels'
                />
            </div>
            <Showcases />
            <div className='mt-8 grid lg:grid-cols-2 gap-4'>
                <Stats />
                <StaffLeaderboard />
            </div>
        </div>
    );
}
