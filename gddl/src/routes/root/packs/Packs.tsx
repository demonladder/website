import { useState } from 'react';
import PackRef from '../../../components/PackRef';
import { useQuery } from '@tanstack/react-query';
import { GetPacks } from '../../../api/packs';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageButtons from '../../../components/PageButtons';
import Container from '../../../components/Container';

export default function Packs() {
    const [page, setPage] = useState(0);
    function pageChange(_page: number) {
        setPage(_page);
    }

    const { status, data: packs, failureReason } = useQuery({
        queryKey: ['packs', {page}],
        queryFn: () => GetPacks(page+1),
    });

    if (status === 'loading') {
        return (
            <Container className='bg-gray-800'>
                <LoadingSpinner />
            </Container>
        );
    } else if (status === 'error') {
        const code = failureReason ? (failureReason as any).code : 'UNKNOWN';
        return (
            <Container className='bg-gray-800'>
                <h1>{(code === 'ERR_NETWORK' && 'Could not connect to the server') || 'An error ocurred'}</h1>
            </Container>
        )
    }

    packs.packs.sort((a, b) => (a.Name > b.Name) ? 1 : -1);

    return (
        <Container className='bg-gray-800'>
            <h1 className='text-4xl mb-1'>Packs</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {packs.packs.map((p) => <div className='text-center' key={p.ID}><PackRef pack={p} key={p.ID} /></div>)}
            </div>
            <PageButtons onPageChange={pageChange} meta={{...packs, page}} />
        </Container>
    )
}