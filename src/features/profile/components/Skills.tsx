import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ChartData } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import Select from '../../../components/Select';
import { useId, useMemo, useState } from 'react';
import CheckBox from '../../../components/input/CheckBox';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import NewLabel from '../../../components/NewLabel';
import { useTags } from '../../../hooks/api/tags/useTags';
import { getSkills } from '../api/getSkills';
import Heading2 from '../../../components/headings/Heading2';

ChartJS.register(RadialLinearScale);

const levelSpanOptions = {
    allTime: 'All',
    top100: 'Top 100',
    top50: 'Top 50',
    top25: 'Top 25',
    top10: 'Top 10',
};
type LevelSpanOptions = keyof typeof levelSpanOptions;

const accuracyOptions = {
    '25': 'High',
    '15': 'Medium',
    '5': 'Low',
    '1': 'Lowest',
};
type AccuracyOptions = keyof typeof accuracyOptions;

export default function Skills({ userID }: { userID: number }) {
    const [levelSpanKey, setLevelSpanKey] = useState<LevelSpanOptions>('allTime');
    const [accuracyKey, setAccuracyKey] = useState<AccuracyOptions>('25');
    const [correctTier, setCorrectTier] = useState(false);
    const correctTierID = useId();
    const [isActive, setIsActive] = useState(false);

    const { data: rawData } = useQuery({
        queryKey: ['user', userID, 'skills', { levelSpan: levelSpanKey, accuracy: accuracyKey, correctTier }],
        queryFn: () => getSkills(userID, levelSpanKey.slice(3), accuracyKey, correctTier),
        enabled: isActive,
    });

    const { data: tags } = useTags();

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
        labels: data.map((tag) => tag.name),
        datasets: [
            {
                label: 'Skills',
                data: data.map((tag) => tag.value),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    };

    if (!isActive) {
        return (
            <section className='mt-6'>
                <Heading2>Skills <NewLabel ID='userSkills' /></Heading2>
                <PrimaryButton onClick={() => setIsActive(true)}>Show</PrimaryButton>
            </section>
        );
    }

    return (
        <section className='mt-6'>
            <Heading2>Skills <NewLabel ID='userSkills' /></Heading2>
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
                    <p>Tier normalization:</p>
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
                                color: 'rgba(255, 255, 255, 0.3)',
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.3)',
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
        </section>
    );
}
