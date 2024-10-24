import { ChartData } from 'chart.js';
import { StatRecordNullable } from '../../../api/stats/padDataSet';

export default function rawDataToChartData(rawData?: StatRecordNullable[], dataSetName = 'dataset1'): ChartData<'line'> {
    return {
        labels: rawData?.map((stat) => stat.Timestamp) || [],
        datasets: [
            {
                label: dataSetName,
                data: rawData?.map((stat) => stat.Value) || [],
                borderColor: '#00ff0090',
                pointRadius: 0,
                pointHitRadius: 10,
                pointBorderColor: '#00000000',
                pointBackgroundColor: '#00ff00',
                tension: 0,
                spanGaps: true,
                segment: {
                    borderColor: (ctx) => (ctx.p0.skip || ctx.p1.skip ? '#aaaaaa' : undefined),
                    borderDash: (ctx) => (ctx.p0.skip || ctx.p1.skip ? [5, 5] : undefined),
                },
            },
        ],
    }
}