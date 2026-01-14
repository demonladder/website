import { useQuery } from '@tanstack/react-query';
import GenericLineChart from './GenericLineChart';
import rawDataToChartData from './rawDataToChartData';
import type { Metrics } from '../../../../api/stats/GetStatistic';
import GetStatistic from '../../../../api/stats/GetStatistic';
import FloatingLoadingSpinner from '../../../../components/ui/FloatingLoadingSpinner';

export default function StatisticLineChart({ metricName, title = 'API data' }: { metricName: Metrics, title?: string }) {
    const { data, status } = useQuery({
        queryKey: ['stats', metricName],
        queryFn: () => GetStatistic(metricName),
    });

    const chartData = rawDataToChartData(data);

    return (
        <div className='relative'>
            <FloatingLoadingSpinner isLoading={status === 'pending'} />
            <GenericLineChart data={chartData} title={title} />
        </div>
    );
}
