import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApproveSubmission, GetSubmissionQueue, Submission as TSubmission } from '../../../api/submissions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Submission from './Submissions';
import { PrimaryButton } from '../../../components/Button';

type SubmissionMutation = TSubmission & {
    deny: boolean,
}

export default function Queue() {
    const { status, isRefetching, data: queue } = useQuery({
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
        approveMutation.mutate({ ...info, deny: false});
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
                    {queue.map((s) => <Submission info={s} approve={approve} remove={deny} key={s.LevelID + '_' + s.UserID} />)}
                    {queue.length === 0 && <h5>Queue empty :D</h5>}
                </div>
            );
        }
    }

    return (
        <div>
            <div className='flex justify-between'>
                <h3 className='text-2xl mb-3'>Submissions</h3>
                <div>
                    {(isRefetching && <LoadingSpinner />) || <PrimaryButton className='flex items-center gap-1' onClick={() => queryClient.invalidateQueries(['submissionQueue'])} disabled={isRefetching}>Refresh <i className='bx bx-refresh'></i></PrimaryButton>}
                </div>
            </div>
            <Content />
        </div>
    );
}