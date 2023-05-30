import React from 'react';
import Difficulty from './Difficulty';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { GetReferences, Reference } from '../../../api/references';

export type Tier = {
    References: Reference[],
    Tier: number,
}

export type Difficulty = {
    Tiers: Tier[],
    Name: string,
}

export default function References () {
    const { status, data: referenceDemons } = useQuery({
        queryKey: ['references'],
        queryFn: GetReferences,
        staleTime: 1000 * 60 * 5
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

    if (referenceDemons.length === 0) {
        return <div className='container'><h1>References are not available</h1></div>;
    }

    referenceDemons.sort((a, b) => (a.Tier > b.Tier) ? 1 : -1);  // Sort in ascending tier order

    // Group into tiers
    const tiers: Tier[] = [];
    for (let i = 0; i < referenceDemons.length; i++) {
        const d = referenceDemons[i]; // Demon
        tiers[d.Tier].References.push(d);
    }
    tiers.forEach((tier, i) => tiers[i].Tier = i+1);

    // Group into difficulties
    const diffs = ['Easy Demons', 'Medium Demons', 'Hard Demons', 'Insane Demons', 'Extreme Demons'];
    const tierSpread = [5, 5, 5, 5, 15];

    const difficulties: Difficulty[] = [];
    for (let i = 0; i < tierSpread.length; i++) {
        difficulties[i] = {
            Name: diffs[i],
            Tiers: tiers.splice(0, tierSpread[i]),
        };
    }

    return (
        <div className='ref-container mb-5'>
            <div className='d-flex references'>
                {
                    difficulties.map(diff => <Difficulty info={diff} key={diff.Name} />)
                }
            </div>
        </div>
    );
}