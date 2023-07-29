import { DeleteSubmission, Submission as TSubmission } from '../../../api/submissions';
import { useQueryClient } from '@tanstack/react-query';
import { DangerButton } from '../../../components/Button';
import { toast } from 'react-toastify';

type Props = {
    submission: TSubmission,
    levelID: number,
}

export default function Submission({ submission, levelID }: Props) {
    const queryClient = useQueryClient();

    async function deletePromise() {
        await DeleteSubmission(levelID, submission.UserID);
        queryClient.invalidateQueries(['submissions']);
    }

    function mutate() {
        toast.promise(deletePromise, {
            pending: 'Deleting',
            success: 'Rating deleted',
            error: 'An error occurred',
        });
    }

    const rating = submission.Rating || '0';
    const enjoyment = submission.Enjoyment || '-1';

    return (
        <div className='submission flex'>
            <DangerButton className='w-8' onClick={mutate}>X</DangerButton>
            <p className={'w-12 text-center tier-' + rating}>{submission.Rating || '-'}</p>
            <p className={'w-12 text-center enj-' + enjoyment}>{(submission.Enjoyment === null) ? '-' : enjoyment}</p>
            <p className='flex-grow ps-2 bg-gray-600'>{submission.Name}</p>
        </div>
    );
}