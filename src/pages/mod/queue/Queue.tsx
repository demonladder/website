import { useQuery } from '@tanstack/react-query';
import GetSubmissionQueue from '../../../api/pendingSubmissions/GetSubmissionQueue';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Submission from './Submission';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import Select from '../../../components/Select';
import { useState } from 'react';
import PageButtons from '../../../components/PageButtons';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import Heading2 from '../../../components/headings/Heading2';
import { NumberEnumParam } from '../../../utils/NumberEnumParam';

const proofFilterOptions = {
    all: 'All',
    extremes: 'Extremes only',
    noExtremes: 'No extremes',
    noProof: 'No proof',
};

const limitOptions = {
    5: '5',
    15: '15',
    30: '30',
    50: '50',
};

export default function Queue() {
    const [proofFilter, setProofFilter] = useState<keyof typeof proofFilterOptions>('all');
    const [limit, setLimit] = useQueryParam('limit', withDefault(NumberEnumParam(limitOptions), 5));
    const [page, setPage] = useQueryParam('page', withDefault(NumberParam, 0));

    const { status, isFetching, data: queue, refetch: refetchQueue } = useQuery({
        queryKey: ['submissionQueue', { limit, page, proofFilter }],
        queryFn: () => GetSubmissionQueue(proofFilter, limit!, page),
    });

    function Content() {
        if (status === 'loading') return <LoadingSpinner />;
        if (status === 'error') return <p>Error: couldn't fetch queue</p>;

        if (queue.total === 0) return <h5>Queue empty :D</h5>;

        return (<ul>{queue.submissions.map((s) => <Submission submission={s} key={s.ID} />)}</ul>);
    }

    return (
        <div>
            <FloatingLoadingSpinner isLoading={isFetching} />
            <div className='flex justify-between'>
                <Heading2 className='mb-3'>Submissions</Heading2>
                <div>
                    <PrimaryButton className='flex items-center gap-1' onClick={() => void refetchQueue()} disabled={isFetching}>Refresh <i className='bx bx-refresh' /></PrimaryButton>
                </div>
            </div>
            <div className='flex gap-4 max-lg:flex-col'>
                <div className='flex gap-2'>
                    <p>Filtering</p>
                    <div className='w-40'>
                        <Select id='submissionQueueSortOrder' options={proofFilterOptions} activeKey={proofFilter} onChange={setProofFilter} />
                    </div>
                </div>
                <div className='flex gap-2'>
                    <p>Submission amount</p>
                    <div className='w-40'>
                        <Select id='submissionQueueLimit' options={limitOptions} activeKey={limit!} onChange={setLimit} />
                    </div>
                </div>
            </div>
            <Content />
            <PageButtons meta={{ limit: limit!, page, total: queue?.total ?? 0 }} onPageChange={(p) => setPage(p)} />
        </div>
    );
}
