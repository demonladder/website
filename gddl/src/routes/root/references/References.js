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
    } else if (status === 'error') {
        return (
            <div className='container'>
                <h1>An error ocurred</h1>
            </div>
        );
    }

    if (referenceDemons.length == 0) {
        return <div className='container'><h1>References are not available</h1></div>;
    }

    referenceDemons.sort((a, b) => (a.Tier > b.Tier) ? 1 : -1);
    
    const diffs = ['Easy', 'Medium', 'Hard', 'Insane', 'Extreme'].map(a => a + ' Demons');
    const tierSpread = [5, 5, 5, 5, 15];
    
    let acc = 0;
    const difficulties = tierSpread.reduce((a, t, i) => {
        a.push({
            name: diffs[i],
            levels: referenceDemons.filter(d => d.Tier > acc && d.Tier <= acc + t)
        });
        acc += t;
        return a;
    }, []);

    return (
        <div className='ref-container mb-5'>
            <div className='d-flex references'>
                {
                    difficulties.map(diff => <Difficulty info={diff} key={diff.name} />)
                }
            </div>
        </div>
    );
}