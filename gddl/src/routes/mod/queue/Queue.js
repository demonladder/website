import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { ApproveSubmission, GetSubmissionQueue } from '../../../api/submissions';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Submission from './Submissions';

export default function Queue() {
    const { status, isRefetching, data: queue } = useQuery({
        queryKey: ['submissionQueue'],
        queryFn: GetSubmissionQueue,
        staleTime: 1000 * 30
    });

    const queryClient = useQueryClient();
    const approveMutation = useMutation({
        mutationFn: (info) => {
            return ApproveSubmission(info).then(() => queryClient.invalidateQueries(['submissionQueue']));
        }
    });

    function approve(info) {
        approveMutation.mutate({ ...info, deny: false});
    }
    function deny(info) {
        approveMutation.mutate({ ...info, deny: true});
    }

    function Content() {
        if (status === 'loading') {
            return <LoadingSpinner />
        } else if (status === 'error') {
            return <h3>An error ocurred</h3>
        } else {
            return (
                <div>
                    {queue.map(s => <Submission info={s} approve={approve} remove={deny} key={s.LevelID + '_' + s.UserID} />)}
                    {queue.length === 0 && <h3>Queue empty :D</h3>}
                </div>
            );
        }
    }

    return (
        <div>
            <div className='d-flex justify-content-between'>
                <h1>Submissions</h1>
                <div>
                    <button onClick={() => queryClient.invalidateQueries(['submissionQueue'])} disabled={isRefetching}>
                        {isRefetching ? <LoadingSpinner /> : 'Refresh'}
                    </button>
                </div>
            </div>
            <Content />
        </div>
    );
}