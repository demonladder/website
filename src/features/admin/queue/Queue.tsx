import { useQuery } from '@tanstack/react-query';
import { getPendingSubmissions } from './api/getPendingSubmissions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Submission from './components/Submission';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import Select from '../../../components/Select';
import PageButtons from '../../../components/PageButtons';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import Heading1 from '../../../components/headings/Heading1';
import useSessionStorage from '../../../hooks/useSessionStorage';
import pluralS from '../../../utils/pluralS';

const proofFilterOptions = {
    all: 'All',
    extremes: 'Extremes only',
    noExtremes: 'No extremes',
    noProof: 'No proof',
};

export default function Queue() {
    const [proofFilter, setProofFilter] = useSessionStorage<keyof typeof proofFilterOptions>('queue.filter', 'all');
    const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 0));

    const { status, isFetching, data: queue } = useQuery({
        queryKey: ['submissionQueue', { page, proofFilter }],
        queryFn: () => getPendingSubmissions(proofFilter, 5, page),
    });

    function Content() {
        if (status === 'pending') return <LoadingSpinner />;
        if (status === 'error') return <p>Error: couldn't fetch queue</p>;

        if (queue.total === 0) return <h5>Queue empty :D</h5>;

        return (<ul>{queue.submissions.map((s) => <Submission submission={s} key={s.ID} />)}</ul>);
    }

    return (
        <div>
            <FloatingLoadingSpinner isLoading={isFetching} />
            <Heading1 className='mb-3'>Pending submissions</Heading1>
            <div className='flex gap-4 max-lg:flex-col'>
                <div className='flex gap-2'>
                    <p>Filtering</p>
                    <div className='w-40'>
                        <Select id='submissionQueueSortOrder' options={proofFilterOptions} activeKey={proofFilter} onChange={setProofFilter} />
                    </div>
                </div>
            </div>
            <Content />
            <PageButtons meta={{ limit: 5, page, total: queue?.total ?? 0 }} onPageChange={(p) => setPage(p)} />
            <p className='text-center'><b>{queue?.total ?? 0}</b> submission{pluralS(queue?.total ?? 0)} found</p>
        </div>
    );
}
