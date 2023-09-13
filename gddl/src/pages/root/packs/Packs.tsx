import { useState } from 'react';
import PackRef from '../../../components/PackRef';
import { useQuery } from '@tanstack/react-query';
import { GetPacks } from '../../../api/packs';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageButtons from '../../../components/PageButtons';
import Container from '../../../components/Container';
import UserLink from '../../../components/UserLink';
import Leaderboard from './Leaderboard';

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
            <Container>
                <LoadingSpinner />
            </Container>
        );
    } else if (status === 'error') {
        const code = failureReason ? (failureReason as any).code : 'UNKNOWN';
        return (
            <Container>
                <h1>{(code === 'ERR_NETWORK' && 'Could not connect to the server') || 'An error ocurred'}</h1>
            </Container>
        )
    }

    packs.packs.sort((a, b) => (a.Name > b.Name) ? 1 : -1);

    return (
        <Container>
            <section>
                <h1 className='text-4xl'>Packs</h1>
                <p className='mb-4'>The pack icons were created by <UserLink userID={138} /> (@cadregadev)</p>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                    {packs.packs.map((p) => <div className='text-center' key={p.ID}><PackRef pack={p} key={p.ID} /></div>)}
                </div>
                <PageButtons onPageChange={pageChange} meta={{...packs, page}} />
            </section>
            <Leaderboard />
        </Container>
    )
}