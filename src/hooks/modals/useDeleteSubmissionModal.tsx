import DeleteSubmissionModal from '../../components/modals/DeleteSubmissionModal';
import useModal from './useModal';

export default function useDeleteSubmissionModal() {
    const { createModal, closeModal } = useModal();

    function open(userID: number, levelID: number, submissionID: number, username: string) {
        const ID = `deleteSubmission-${userID}-${levelID}`;

        createModal(
            ID,
            <DeleteSubmissionModal
                onClose={() => closeModal(ID)}
                userID={userID}
                levelID={levelID}
                submissionID={submissionID}
                username={username}
            />,
        );
    }

    return open;
}
