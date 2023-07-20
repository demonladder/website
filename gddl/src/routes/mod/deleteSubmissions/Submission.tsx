import { DeleteSubmission, Submission as TSubmission } from '../../../api/submissions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DangerButton } from '../../../components/Button';

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
        <div className='submission flex'>
            <DangerButton onClick={() => mutation.mutate({ levelID, userID: submission.UserID })}>X</DangerButton>
            <p className={'w-1/12 text-center tier-' + submission.Rating}>{submission.Rating}</p>
            <p className={'w-1/12 text-center enj-' + submission.Enjoyment}>{submission.Enjoyment}</p>
            <p className='flex-grow ps-2 bg-gray-600'>{submission.Name}</p>
        </div>
    );
}