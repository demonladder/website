import ApproveSubmission from '../../../api/submissions/ApproveSubmission';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import { useQueryClient } from '@tanstack/react-query';

export function useApproveClicked() {
    const queryClient = useQueryClient();

    function invalidateQueries(userID: number) {
        queryClient.invalidateQueries(['submissionQueue']);
        queryClient.invalidateQueries(['stats']);
        queryClient.invalidateQueries(['staffLeaderboard']);
        queryClient.invalidateQueries(['user', userID, 'submissions', 'pending']);
    }

    return (levelID: number, userID: number, onlyEnjoyment = false) => {
        toast.promise(ApproveSubmission(levelID, userID, onlyEnjoyment).then(() => invalidateQueries(userID)), {
            pending: 'Approving...',
            success: 'Approved!',
            error: renderToastError,
        });
    }
}