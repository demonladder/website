import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ChartData } from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import Select from '../../../components/shared/input/Select';
import { useId, useMemo, useState } from 'react';
import CheckBox from '../../../components/input/CheckBox';
import { useTags } from '../../../hooks/api/tags/useTags';
import { getSkills } from '../api/getSkills';
import Heading2 from '../../../components/headings/Heading2';
import Divider from '../../../components/divider/Divider';
import { useInView } from 'react-intersection-observer';
import { useWindowSize } from 'usehooks-ts';

ChartJS.register(RadialLinearScale);

const levelSpanOptions = {
    allTime: 'All',
    top100: 'Top 100',
    top50: 'Top 50',
    top25: 'Top 25',
    top10: 'Top 10',
};
type LevelSpanOptions = keyof typeof levelSpanOptions;

export default function Skills({ userID }: { userID: number }) {
    const { ref, inView } = useInView();
    const [levelSpanKey, setLevelSpanKey] = useState<LevelSpanOptions>('allTime');
    const [correctTier, setCorrectTier] = useState(false);
    const correctTierID = useId();
    const [adjustRarity, setAdjustRarity] = useState(true);
    const adjustRarityID = useId();

    const { data: rawData } = useQuery({
        queryKey: ['user', userID, 'skills', { levelSpan: levelSpanKey.slice(3), tierCorrection: correctTier, adjustRarity }],
        queryFn: () => getSkills(userID, { levelSpan: levelSpanKey.slice(3), tierCorrection: correctTier, adjustRarity }),
        enabled: inView,
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
        return merged.sort((a, b) => order.indexOf(a.ID) - order.indexOf(b.ID));
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

    const windowSize = useWindowSize();
    const textColor = window.getComputedStyle(document.querySelector('#root > div')!).getPropertyValue('--color-theme-text');

    return (
        <section className='mt-6' ref={ref}>
            <Heading2>Skills</Heading2>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-4'>
                <div>
                    <label htmlFor='skillLevelSpan'>Levels included:</label>
                    <div className='max-w-xs'>
                        <Select options={levelSpanOptions} activeKey={levelSpanKey} id='skillLevelSpan' onChange={setLevelSpanKey} />
                    </div>
                </div>
                <div>
                    <p>Tier normalization:</p>
                    <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none' htmlFor={correctTierID}>
                        <CheckBox id={correctTierID} checked={correctTier} onChange={() => setCorrectTier((prev) => !prev)} />
                        Adjust for level tier
                    </label>
                </div>
                <div>
                    <p>Rarity adjustment:</p>
                    <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none' htmlFor={adjustRarityID}>
                        <CheckBox id={adjustRarityID} checked={adjustRarity} onChange={() => setAdjustRarity((prev) => !prev)} />
                        Adjust for skillset rarity
                    </label>
                </div>
            </div>
            <Divider />
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
                                color: textColor,
                                font: {
                                    size: windowSize.width > 720 ? 22 : 14,
                                },
                            },
                            min: 0,
                            beginAtZero: true,
                            ticks: {
                                display: false,
                            },
                        },
                    },
                }} />
            </div>
        </section>
    );
}
