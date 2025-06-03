import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import Page from '../../components/Page';
import LoadingSpinner from '../../components/LoadingSpinner';
import Heading1 from '../../components/headings/Heading1';
import Category from './components/Category';
import UserLink from '../../components/UserLink';
import { getPacks } from './api/getPacks';
import Leaderboard from './components/Leaderboard';

export default function Packs() {
    const { status, data: packs } = useQuery({
        queryKey: ['packs'],
        queryFn: getPacks,
    });

    if (status === 'pending') return <Page><LoadingSpinner /></Page>;
    if (status === 'error') return <Page><p>Error: could not fetch packs from server</p></Page>;

    return (
        <Page>
            <Helmet>
                <title>GDDL | Packs</title>
            </Helmet>
            <section>
                <Heading1>Packs</Heading1>
                <p className='mb-8'>The pack icons were created by <UserLink userID={138} /> (@aamberette)</p>
                {packs.categories.map((c) => (
                    <Category category={c} packs={packs.packs.filter((p) => p.CategoryID == c.ID)} key={'packCategory_' + c.Name} />
                ))}
            </section>
            <Leaderboard />
        </Page>
    );
}
