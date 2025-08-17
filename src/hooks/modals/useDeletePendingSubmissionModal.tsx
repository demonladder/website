import DeletePendingSubmissionModal from '../../components/modals/DeletePendingSubmissionModal';
import useModal from './useModal';

export default function useDeletePendingSubmissionModal() {
    const { createModal, closeModal } = useModal();

    function open({ UserID: userID, LevelID: levelID, ID: submissionID }: { UserID: number, LevelID: number, ID: number }, username: string) {
        const ID = `deletePendingSubmission-${userID}-${levelID}`;

        createModal(
            ID,
            <DeletePendingSubmissionModal onClose={() => closeModal(ID)} userID={userID} levelID={levelID} submissionID={submissionID} username={username} />,
        );
    }

    return open;
}
