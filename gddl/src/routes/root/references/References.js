import React from 'react';
import { useLoaderData } from 'react-router-dom';
import Difficulty from './Difficulty';
import Level from './Level';

export async function referencesLoader() {
    return fetch('http://localhost:8080/getReferences')
           .then(res => res.json());
}

export default function References () {
    const referenceDemons = useLoaderData();

    let difficulties = [
        {
            name: 'Easy Demons',
            minRange: 1,
            maxRange: 5
        },
        {
            name: 'Medium Demons',
            minRange: 6,
            maxRange: 10
        }
    ];

    // Set up tiers array
    for (let diff of difficulties) {
        diff.tiers = [];
        for (let i = diff.minRange; i <= diff.maxRange; i++) {
            diff.tiers.push({
                tier: i,
                levels: []
            });
        }
    }

    for (let level of referenceDemons) {
        for (let tier of difficulties) {
            if (level.Tier >= tier.minRange && level.Tier <= tier.maxRange) {
                tier.tiers.find(t => t.tier == level.Tier).levels.push(level);
            }
        }
    }

    console.log(difficulties);

    return (
        <div className='d-flex'>
            {difficulties.map(diff => <Difficulty info={diff} key={diff.name} />)}
        </div>
    );
}