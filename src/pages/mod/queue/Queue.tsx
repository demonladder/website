import { useQuery, useQueryClient } from '@tanstack/react-query';
import DenySubmission from '../../../api/submissions/DenySubmission';
import GetSubmissionQueue, { QueueSubmission } from '../../../api/pendingSubmissions/GetSubmissionQueue';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Submission from './Submission';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import Select from '../../../components/Select';
import { useState } from 'react';
import PageButtons from '../../../components/PageButtons';

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
    const [limit, setLimit] = useState<keyof typeof limitOptions>(5);
    const [page, setPage] = useState(0);

    const { status, isFetching, data: queue, refetch: refetchQueue } = useQuery({
        queryKey: ['submissionQueue', { limit, page, proofFilter }],
        queryFn: () => GetSubmissionQueue(proofFilter, limit, page),
    });

    const queryClient = useQueryClient();

    function invalidateQueries() {
        void refetchQueue();
        void queryClient.invalidateQueries(['stats']);
        void queryClient.invalidateQueries(['staffLeaderboard']);
    }

    function deny(info: QueueSubmission, reason?: string) {
        void toast.promise(DenySubmission(info.ID, reason).then(invalidateQueries), {
            pending: 'Denying...',
            success: 'Denied!',
            error: renderToastError,
        });
    }

    function Content() {
        if (status === 'loading') return <LoadingSpinner />;
        if (status === 'error') return <p>Error: couldn't fetch queue</p>;

        return (
            <ul>
                {queue.submissions.map((s) => <Submission submission={s} remove={deny} key={s.ID} />)}
                {queue.total === 0 && <h5>Queue empty :D</h5>}
                {queue.total > limit && <p className='font-bold text-lg text-center my-3'>+ {queue.total - limit} more</p>}
            </ul>
        );
    }

    return (
        <div>
            <FloatingLoadingSpinner isLoading={isFetching} />
            <div className='flex justify-between'>
                <h3 className='text-2xl mb-3'>Submissions</h3>
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
                        <Select id='submissionQueueLimit' options={limitOptions} activeKey={limit} onChange={setLimit} />
                    </div>
                </div>
            </div>
            <Content />
            <PageButtons meta={{ limit, page, total: queue?.total ?? 0 }} onPageChange={(p) => setPage(p)} />
        </div>
    );
}
