import LoadingSpinner from '../../../components/LoadingSpinner';
import Difficulty from './Difficulty';
import { useReferences } from '../../../api/references/hooks/useReferences';
import Page from '../../../components/Page';

const diffs = [
    {
        name: 'Easy Demons',
        minTier: 1,
        maxTier: 5,
    },
    {
        name: 'Medium Demons',
        minTier: 6,
        maxTier: 10,
    },
    {
        name: 'Hard Demons',
        minTier: 11,
        maxTier: 15,
    },
    {
        name: 'Insane Demons',
        minTier: 16,
        maxTier: 20,
    },
    {
        name: 'Extreme Demons',
        minTier: 21,
        maxTier: 40,
    },
];

export default function References() {
    const { status, data: referenceDemons } = useReferences();

    if (status === 'loading') return <LoadingSpinner />;
    if (status === 'error') return <Page><h1 className='text-4xl'>Error: could not fetch references</h1></Page>;

    return (
        <div className='max-w-[95%] overflow-x-scroll mx-auto my-4'>
            <div className='flex max-sm:flex-col'>
                {
                    diffs.map((diff) => <Difficulty name={diff.name} minTier={diff.minTier} maxTier={diff.maxTier} key={diff.name} references={referenceDemons} />)
                }
            </div>
        </div>
    );
}
