import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ChartData } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import APIClient from '../../../api/APIClient';
import GetTags from '../../../api/tags/GetTags';
import Select from '../../../components/Select';
import { useId, useMemo, useState } from 'react';
import CheckBox from '../../../components/input/CheckBox';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import NewLabel from '../../../components/NewLabel';

ChartJS.register(RadialLinearScale);

async function GetSkills(userID: number, levelSpan: string, accuracy: string, correctTier = false) {
    const n = levelSpan === 'allTime' ? 20000 : parseInt(levelSpan.slice(3));

    const res = await APIClient.get<Record<string, number>>(`/user/${userID}/skills`, { params: { span: n, accuracy, correctTier } });
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
    const [correctTier, setCorrectTier] = useState(false);
    const correctTierID = useId();
    const [isActive, setIsActive] = useState(false);

    const { data: rawData } = useQuery({
        queryKey: ['user', userID, 'skills', { levelSpan: levelSpanKey, accuracy: accuracyKey, correctTier }],
        queryFn: () => GetSkills(userID, levelSpanKey, accuracyKey, correctTier),
        enabled: isActive,
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

        const order = [1, 2, 3, 4, 5, 6, 7, 8, 17, 9, 10, 11, 18, 12, 13, 14, 16, 19, 20, 15];
        return merged.sort((a, b) => order.indexOf(a.ordering) - order.indexOf(b.ordering));
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

    if (!isActive) {
        return (
            <div>
                <h2 className='text-3xl mt-6'>Skills <NewLabel ID='userSkills' /></h2>
                <PrimaryButton onClick={() => setIsActive(true)}>Show</PrimaryButton>
            </div>
        );
    }

    return (
        <div>
            <h2 className='text-3xl mt-6'>Skills <NewLabel ID='userSkills' /></h2>
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
                <div>
                    <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none' htmlFor={correctTierID}>
                        <CheckBox id={correctTierID} checked={correctTier} onChange={() => setCorrectTier((prev) => !prev)} />
                        Adjust for level tier
                    </label>
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
