import { UserSubmission } from '../../api/user/GetUserSubmissions';
import DeleteSubmissionModal from '../../components/modals/DeleteSubmissionModal';
import useModal from './useModal';

export default function useDeleteSubmissionModal() {
    const { createModal, closeModal } = useModal();

    function open(submission: UserSubmission) {
        const ID = `deleteSubmission-${submission.UserID}-${submission.LevelID}`;

        createModal(
            ID,
            <DeleteSubmissionModal onClose={() => closeModal(ID)} submission={submission} />,
        );
    }

    return open;
}