import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetPacks } from '../../../api/packs';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageButtons from '../../../components/PageButtons';
import Container from '../../../components/Container';
import UserLink from '../../../components/UserLink';
import Leaderboard from './Leaderboard';
import Category from './Category';

export default function Packs() {
    const [page, setPage] = useState(1);
    function pageChange(_page: number) {
        setPage(_page);
    }

    const { status, data: packs, failureReason } = useQuery({
        queryKey: ['packs', { page }],
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
                <p className='mb-8'>The pack icons were created by <UserLink userID={138} /> (@cadregadev)</p>
                {packs.categories.map((c) => (
                    <Category category={c} packs={packs.packs.filter((p) => p.CategoryID == c.ID)} key={'packCategory_' + c.Name} />
                ))}
                <PageButtons onPageChange={pageChange} meta={{...packs, page}} />
            </section>
            <Leaderboard />
        </Container>
    )
}