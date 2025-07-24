import LoadingSpinner from '../../components/LoadingSpinner';
import Difficulty from './components/Difficulty';
import { useReferences } from './hooks/useReferences';
import Page from '../../components/Page';
import Heading1 from '../../components/headings/Heading1';
import { Helmet } from 'react-helmet-async';

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

    if (status === 'pending') return <LoadingSpinner />;
    if (status === 'error') return <Page><Heading1>Error: could not fetch references</Heading1></Page>;

    return (
        <div className='max-w-[95%] overflow-x-scroll scrollbar-thin mx-auto my-4'>
            <Helmet>
                <title>GDDL | References</title>
            </Helmet>
            <div className='flex max-sm:flex-col'>
                {
                    diffs.map((diff) => <Difficulty name={diff.name} minTier={diff.minTier} maxTier={diff.maxTier} key={diff.name} references={referenceDemons} />)
                }
            </div>
        </div>
    );
}
