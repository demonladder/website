import React from 'react';
import PackRef from '../../../components/PackRef';
import { useQuery } from '@tanstack/react-query';
import { GetPacks, Pack } from '../../../api/packs';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function Packs() {
    const { status, data: packs, failureReason } = useQuery({
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
        const code = failureReason ? (failureReason as {code: string}).code : 'UNKNOWN';
        return (
            <div className='container'>
                <h1>{(code === 'ERR_NETWORK' && 'Could not connect to the server') || 'An error ocurred'}</h1>
            </div>
        )
    }

    packs.sort((a: Pack, b: Pack) => (a.Name > b.Name) ? 1 : -1);

    return (
        <div className='container'>
            <h1 className='mb-4'>Packs</h1>
            <div className='row'>
                {packs.map((p: Pack) => <div className='mb-2 col-4 text-center' key={p.ID}><PackRef pack={p} key={p.ID} /></div>)}
            </div>
        </div>
    )
}