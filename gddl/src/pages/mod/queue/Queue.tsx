import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApproveSubmission, DenySubmission, GetSubmissionQueue, Submission as TSubmission } from '../../../api/submissions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Submission from './Submission';
import { PrimaryButton } from '../../../components/Button';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import Select from '../../../components/Select';
import { useState } from 'react';

const proofFilterOptions = {
    all: 'All',
    extremes: 'Extremes only',
    noExtremes: 'No extremes',
    noProof: 'No proof',
};

export default function Queue() {
    const [proofFilter, setProofFilter] = useState('all');

    const { status, isFetching, data: queue } = useQuery({
        queryKey: ['submissionQueue', proofFilter],
        queryFn: () => GetSubmissionQueue(proofFilter),
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
                    {queue.submissions.map((s) => <Submission info={s} approve={approve} remove={deny} key={s.LevelID + '_' + s.UserID} />)}
                    {queue.total === 0 && <h5>Queue empty :D</h5>}
                    {queue.total > 5 && <p className='font-bold text-lg text-center my-3'>+ {queue.total - 5} more</p>}
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
            <div className='flex gap-2'>
                <p>Filtering</p>
                <div className='w-40'>
                    <Select id='submissionQueueSortOrder' options={proofFilterOptions} activeKey={proofFilter} onChange={setProofFilter} />
                </div>
            </div>
            <Content />
        </div>
    );
}