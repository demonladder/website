import ApproveSubmission from '../../../api/submissions/ApproveSubmission';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import { useQueryClient } from '@tanstack/react-query';

export function useApproveClicked() {
    const queryClient = useQueryClient();

    function invalidateQueries(userID: number, levelID: number) {
        void queryClient.invalidateQueries(['submissionQueue']);
        void queryClient.invalidateQueries(['stats']);
        void queryClient.invalidateQueries(['staffLeaderboard']);
        void queryClient.invalidateQueries(['user', userID, 'submissions']);
        void queryClient.invalidateQueries(['level', levelID]);
    }

    return (ID: number, levelID: number, userID: number, onlyEnjoyment = false, proofReviewTime?: number | null) => {
        void toast.promise(ApproveSubmission(ID, onlyEnjoyment, proofReviewTime).then(() => invalidateQueries(userID, levelID)), {
            pending: 'Approving...',
            success: 'Approved!',
            error: renderToastError,
        });
    };
}
