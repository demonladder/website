import Level from '../../api/types/Level';
import LevelMeta from '../../api/types/LevelMeta';
import Submission from '../../api/types/Submission';
import DeleteSubmissionModal from '../../components/modals/DeleteSubmissionModal';
import useModal from './useModal';

export default function useDeleteSubmissionModal() {
    const { createModal, closeModal } = useModal();

    function open(level: Level & { Meta: LevelMeta }, submission: Submission) {
        const ID = `deleteSubmission-${submission.UserID}-${submission.LevelID}`;

        createModal(
            ID,
            <DeleteSubmissionModal onClose={() => closeModal(ID)} level={level} submission={submission} />,
        );
    }

    return open;
}
