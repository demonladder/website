import PendingSubmission from '../../api/types/PendingSubmission';
import DenySubmissionModal from '../../pages/mod/queue/DenySubmissionModal';
import useModal from './useModal';

export default function useDenySubmissionModal() {
    const { createModal, closeModal } = useModal();

    function open(submission: PendingSubmission) {
        const ID = `denySubmission-${submission.UserID}-${submission.LevelID}`;

        createModal(
            ID,
            <DenySubmissionModal onClose={() => closeModal(ID)} submission={submission} />,
        );
    }

    return open;
}
