import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApproveSubmission, GetSubmissionQueue, Submission as TSubmission } from '../../../api/submissions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Submission from './Submissions';
import { PrimaryButton } from '../../../components/Button';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';

type SubmissionMutation = TSubmission & {
    deny: boolean,
}

export default function Queue() {
    const { status, isFetching, data: queue } = useQuery({
        queryKey: ['submissionQueue'],
        queryFn: GetSubmissionQueue,
    });

    const queryClient = useQueryClient();
    const approveMutation = useMutation({
        mutationFn: async (info: SubmissionMutation) => {
            await ApproveSubmission(info);
            return await queryClient.invalidateQueries(['submissionQueue']);
        }
    });

    function approve(info: TSubmission) {
        toast.promise(ApproveSubmission({ ...info, deny: false }).then(() => {queryClient.invalidateQueries(['submissionQueue']); queryClient.invalidateQueries(['stats'])}), {
            pending: 'Approving...',
            success: 'Approved!',
            error: renderToastError,
        });
    }
    function deny(info: TSubmission) {
        approveMutation.mutate({ ...info, deny: true});
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
            <Content />
        </div>
    );
}