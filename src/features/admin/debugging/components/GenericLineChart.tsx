import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, TimeScale, Title, Tooltip, Legend);

export default function GenericLineChart({ data, title }: { data?: ChartData<'line'>; title: string }) {
    if (!data) return;

    return (
        <Line
            data={data}
            options={{
                plugins: {
                    title: {
                        text: title,
                        display: true,
                        color: '#ffffff',
                    },
                    legend: {
                        display: false,
                    },
                },
                interaction: {
                    intersect: false,
                },
                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 7,
                        },
                        type: 'time',
                        time: {
                            unit: 'minute',
                            displayFormats: {
                                minute: 'hh:mm',
                            },
                        },
                    },
                    y: {
                        min: 0,
                    },
                },
            }}
        />
    );
}
