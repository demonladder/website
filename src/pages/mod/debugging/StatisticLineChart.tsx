import { useQuery } from '@tanstack/react-query';
import GetStatistic, { Metrics } from '../../../api/stats/GetStatistic';
import GenericLineChart from './GenericLineChart';
import rawDataToChartData from './rawDataToChartData';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';

export default function StatisticLineChart({ metricName, title = 'API data' }: { metricName: Metrics, title?: string }) {
    const { data, status } = useQuery({
        queryKey: ['stats', metricName],
        queryFn: () => GetStatistic(metricName),
    });

    const chartData = rawDataToChartData(data);

    return (
        <div className='relative'>
            <FloatingLoadingSpinner isLoading={status === 'loading'} />
            <GenericLineChart data={chartData} title={title} />
        </div>
    )
}