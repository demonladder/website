import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ChartData } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import APIClient from '../../../api/APIClient';
import GetTags from '../../../api/tags/GetTags';
import Select from '../../../components/Select';
import { useMemo, useState } from 'react';

ChartJS.register(RadialLinearScale);

async function GetSkills(userID: number, levelSpan: string, accuracy: string) {
    const n = levelSpan === 'allTime' ? 20000 : parseInt(levelSpan.slice(3));

    const res = await APIClient.get<Record<string, number>>(`/user/${userID}/skills`, { params: { span: n, accuracy } });
    return res.data;
}

const levelSpanOptions = {
    allTime: 'All',
    top100: 'Top 100',
    top50: 'Top 50',
    top25: 'Top 25',
    top10: 'Top 10',
};

const accuracyOptions = {
    25: 'High',
    15: 'Medium',
    5: 'Low',
    1: 'Lowest',
}

export default function Skills({ userID }: { userID: number }) {
    const [levelSpanKey, setLevelSpanKey] = useState('allTime');
    const [accuracyKey, setAccuracyKey] = useState('25');

    const { data: rawData } = useQuery({
        queryKey: ['user', userID, 'skills', { levelSpan: levelSpanKey, accuracy: accuracyKey }],
        queryFn: () => GetSkills(userID, levelSpanKey, accuracyKey),
    });

    const { data: tags } = useQuery({
        queryKey: ['tags'],
        queryFn: GetTags,
    });

    const data = useMemo(() => {
        // Merge rawData onto tags
        if (!rawData || !tags) return [];

        const merged = [];
        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];

            merged[i] = {
                ID: tag.ID,
                name: tag.Name,
                ordering: tag.Ordering,
                value: rawData[tag.ID] || 0,
            };
        }

        return merged;
    }, [rawData, tags]);

    const chartData: ChartData<'radar'> = {
        labels: data.map(tag => tag.name),
        datasets: [
            {
                label: 'Skills',
                data: data.map(tag => tag.value),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    };

    return (
        <div>
            <h2 className='text-3xl mt-6'>Skills</h2>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-4'>
                <div>
                    <label htmlFor='skillLevelSpan'>Levels included:</label>
                    <div className='max-w-xs'>
                        <Select options={levelSpanOptions} activeKey={levelSpanKey} id='skillLevelSpan' onChange={setLevelSpanKey} />
                    </div>
                </div>
                <div>
                    <label htmlFor='skillAccuracy'>Accuracy:</label>
                    <div className='max-w-xs'>
                        <Select options={accuracyOptions} activeKey={accuracyKey} id='skillAccuracy' onChange={setAccuracyKey} />
                    </div>
                </div>
            </div>
            <div className='divider my-4'></div>
            <div className='mx-auto xl:w-1/2'>
                <Radar data={chartData} options={{
                    scales: {
                        r: {
                            angleLines: {
                                color: 'rgba(255, 255, 255, 0.3',
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.3',
                            },
                            pointLabels: {
                                color: 'white',
                            },
                            min: 0,
                            beginAtZero: true,
                        },
                    },
                }} />
            </div>
        </div>
    );
}
