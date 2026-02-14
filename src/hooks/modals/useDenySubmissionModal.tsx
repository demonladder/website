import DenySubmissionModal from '../../features/admin/queue/components/DenySubmissionModal';
import useModal from './useModal';

export default function useDenySubmissionModal() {
    const { createModal, closeModal } = useModal();

    function open(submission: Parameters<typeof DenySubmissionModal>[0]['submission']) {
        const ID = `denySubmission-${submission.ID}`;

        createModal(ID, <DenySubmissionModal onClose={() => closeModal(ID)} submission={submission} />);
    }

    return open;
}
