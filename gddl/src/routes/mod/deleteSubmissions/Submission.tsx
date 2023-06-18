import React from 'react';
import { DeleteSubmission, Submission as TSubmission } from '../../../api/submissions';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Props = {
    submission: TSubmission,
    levelID: number,
}

export default function Submission({ submission, levelID }: Props) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: DeleteSubmission,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: ({ queryKey }: { queryKey: any }) => queryKey[0] === 'submissions' && queryKey[1].levelID === levelID,
            });
        }
    });

    return (
        <div className='submission'>
            <button className='danger' onClick={() => mutation.mutate({ levelID, userID: submission.UserID })}>X</button>
            <p className={'tier-' + submission.Rating}>{submission.Rating}</p>
            <p className={'enj-' + submission.Enjoyment}>{submission.Enjoyment}</p>
            <p className='username'>{submission.Name}</p>
        </div>
    );
}