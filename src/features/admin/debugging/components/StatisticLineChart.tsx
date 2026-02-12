import { useQuery } from '@tanstack/react-query';
import GenericLineChart from './GenericLineChart';
import rawDataToChartData from './rawDataToChartData';
import { statsClient, type Metrics } from '../../../../api/stats';
import FloatingLoadingSpinner from '../../../../components/ui/FloatingLoadingSpinner';

interface Props {
    metricName: Metrics;
    title?: string;
}

export default function StatisticLineChart({ metricName, title = 'API data' }: Props) {
    const { data, status } = useQuery({
        queryKey: ['stats', metricName],
        queryFn: () => statsClient.getMetric(metricName),
    });

    const chartData = rawDataToChartData(data);

    return (
        <div className='relative'>
            <FloatingLoadingSpinner isLoading={status === 'pending'} />
            <GenericLineChart data={chartData} title={title} />
        </div>
    );
}
