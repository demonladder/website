import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { GetReferences, Reference } from '../../../api/references';
import Difficulty from './Difficulty';

export type Tier = {
    References: Reference[],
    Tier: number,
}

export type TDifficulty = {
    Tiers: Tier[],
    Name: string,
}

export default function References() {
    const { status, data: referenceDemons } = useQuery({
        queryKey: ['references'],
        queryFn: GetReferences,
    });

    if (status === 'loading') {
        return <LoadingSpinner />;
    } else if (status === 'error') {
        return (
            <div className='container'>
                <h1>An error ocurred</h1>
            </div>
        );
    }

    if (referenceDemons === undefined) {
        return (
            <div className='container'>
                <h1>An error occurred</h1>
            </div>
        );
    }

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
            maxTier: 35,
        },
    ];
    
    return (
        <div className='max-w-[95%] overflow-x-scroll mx-auto mt-4'>
            <div className='flex max-sm:flex-col'>
                {
                    diffs.map((diff) => <Difficulty name={diff.name} minTier={diff.minTier} maxTier={diff.maxTier} key={diff.name} references={referenceDemons} />)
                }
            </div>
        </div>
    );
}