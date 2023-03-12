import React from 'react';
import PackRef from '../../../components/PackRef';
import { useQuery } from '@tanstack/react-query';
import { GetPacks } from '../../../api/packs';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function Packs() {
    const { status, data: packs } = useQuery({
        queryKey: ['packs'],
        queryFn: GetPacks
    });

    if (status === 'loading') {
        return (
            <div className='container'>
                <LoadingSpinner />
            </div>
        );
    } else if (status === 'error') {
        return (
            <div className='container'>
                <h1>An error ocurred</h1>
            </div>
        )
    }

    packs.sort((a, b) => {
        if (a.Name < b.Name) return -1
        if (a.Name > b.Name) return 1
        return 0;
    });

    return (
        <div className='container'>
            <h1 className='mb-4'>Packs</h1>
            <div className='row'>
                {packs.map(p => <div className='mb-2 col-4 text-center' key={p.ID}><PackRef pack={p} key={p.ID} /></div>)}
            </div>
        </div>
    )
}