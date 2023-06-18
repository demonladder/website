import React, { useState } from 'react';
import PackRef from '../../../components/PackRef';
import { useQuery } from '@tanstack/react-query';
import { GetPacks } from '../../../api/packs';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageButtons from '../../../components/PageButtons';

export default function Packs() {
    const [page, setPage] = useState(1);
    function pageChange(_page: number) {
        setPage(_page);
    }

    const { status, data: packs, failureReason } = useQuery({
        queryKey: ['packs', {page}],
        queryFn: () => GetPacks(page),
    });

    if (status === 'loading') {
        return (
            <div className='container'>
                <LoadingSpinner />
            </div>
        );
    } else if (status === 'error') {
        const code = failureReason ? (failureReason as any).code : 'UNKNOWN';
        return (
            <div className='container'>
                <h1>{(code === 'ERR_NETWORK' && 'Could not connect to the server') || 'An error ocurred'}</h1>
            </div>
        )
    }

    packs.packs.sort((a, b) => (a.Name > b.Name) ? 1 : -1);

    return (
        <div className='container'>
            <h1 className='mb-4'>Packs</h1>
            <div className='row'>
                {packs.packs.map((p) => <div className='mb-2 col-6 col-md-4 text-center' key={p.ID}><PackRef pack={p} key={p.ID} /></div>)}
                <PageButtons onPageChange={pageChange} page={page} meta={packs} />
            </div>
        </div>
    )
}