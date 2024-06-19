import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApproveSubmission, DenySubmission } from '../../../api/submissions';
import { GetSubmissionQueue } from '../../../api/pendingSubmissions/GetSubmissionQueue';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Submission from './Submission';
import { PrimaryButton } from '../../../components/Button';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import Select from '../../../components/Select';
import { useState } from 'react';
import TSubmission from '../../../api/types/Submission';
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
    const [proofFilter, setProofFilter] = useState('all');
    const [limit, setLimit] = useState('5');
    const [page, setPage] = useState(1);

    const { status, isFetching, data: queue } = useQuery({
        queryKey: ['submissionQueue', { limit, page, proofFilter }],
        queryFn: () => GetSubmissionQueue(proofFilter, parseInt(limit), page),
    });

    const queryClient = useQueryClient();

    function invalidateQueries() {
        queryClient.invalidateQueries(['submissionQueue']);
        queryClient.invalidateQueries(['stats']);
        queryClient.invalidateQueries(['staffLeaderboard']);
    }

    function approve(info: TSubmission, onlyEnjoyment = false) {
        toast.promise(ApproveSubmission({ ...info, onlyEnjoyment }).then(invalidateQueries), {
            pending: 'Approving...',
            success: 'Approved!',
            error: renderToastError,
        });
    }
    function deny(info: TSubmission, reason?: string) {
        toast.promise(DenySubmission({ ...info, reason }).then(invalidateQueries), {
            pending: 'Denying...',
            success: 'Denied!',
            error: renderToastError,
        });
    }

    function Content() {
        if (status === 'loading') {
            return <LoadingSpinner />
        } else if (status === 'error') {
            return <p>An error ocurred</p>
        } else {
            return (
                <div>
                    {queue.submissions.map((s) => <Submission submission={s} approve={approve} remove={deny} key={s.LevelID + '_' + s.UserID} />)}
                    {queue.total === 0 && <h5>Queue empty :D</h5>}
                    {queue.total > parseInt(limit) && <p className='font-bold text-lg text-center my-3'>+ {queue.total - parseInt(limit)} more</p>}
                </div>
            );
        }
    }

    return (
        <div>
            <FloatingLoadingSpinner isLoading={isFetching} />
            <div className='flex justify-between'>
                <h3 className='text-2xl mb-3'>Submissions</h3>
                <div>
                    <PrimaryButton className='flex items-center gap-1' onClick={() => queryClient.invalidateQueries(['submissionQueue'])} disabled={isFetching}>Refresh <i className='bx bx-refresh'></i></PrimaryButton>
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
            <PageButtons meta={{ limit: parseInt(limit), page, total: queue?.total ?? 0 }} onPageChange={(p) => setPage(p)} />
        </div>
    );
}