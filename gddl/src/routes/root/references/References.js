import React from 'react';
import Difficulty from './Difficulty';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { GetReferences } from '../../../api/references';

export default function References () {
    const { status, data: referenceDemons } = useQuery({
        queryKey: ['references'],
        queryFn: GetReferences,
        staleTime: 1000 * 60 * 5
    });

    if (status === 'loading') {
        return <LoadingSpinner />;
    }

    let difficulties = [
        {
            name: 'Easy Demons',
            minRange: 1,
            maxRange: 5,
            css: 1
        },
        {
            name: 'Medium Demons',
            minRange: 6,
            maxRange: 10,
            css: 2
        },
        {
            name: 'Hard Demons',
            minRange: 11,
            maxRange: 15,
            css: 3
        },
        {
            name: 'Insane Demons',
            minRange: 16,
            maxRange: 20,
            css: 4
        },
        {
            name: 'Extreme Demons',
            minRange: 21,
            maxRange: 35,
            css: 5
        }
    ];

    // Set up tiers array
    for (let diff of difficulties) {
        diff.tiers = [];
        for (let i = diff.minRange; i <= diff.maxRange; i++) {
            diff.tiers.push({
                tier: i,
                relativeTier: i - diff.minRange + 1,
                levels: []
            });
        }
    }

    for (let level of referenceDemons) {
        for (let tier of difficulties) {
            if (level.Tier >= tier.minRange && level.Tier <= tier.maxRange) {
                tier.tiers.find(t => t.tier === level.Tier).levels.push(level);
            }
        }
    }

    return (
        <>
            <div className='ref-container mb-5'>
                <div className='d-flex references'>
                    {difficulties.map(diff => <Difficulty info={diff} key={diff.name} />)}
                </div>
            </div>
        </>
    );
}