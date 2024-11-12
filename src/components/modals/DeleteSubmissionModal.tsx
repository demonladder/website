import { toast } from 'react-toastify';
import { DangerButton, SecondaryButton } from '../Button';
import Modal from '../Modal';
import DeleteSubmission from '../../api/submissions/DeleteSubmission';
import { useQueryClient } from '@tanstack/react-query';
import renderToastError from '../../utils/renderToastError';
import Submission from '../../api/types/Submission';
import LevelMeta from '../../api/types/LevelMeta';
import Level from '../../api/types/Level';

interface Props {
    level: Level & { Meta: LevelMeta };
    submission: Submission;
    onClose: () => void;
}

export default function DeleteSubmissionModal({ level, submission, onClose: close }: Props) {
    const queryClient = useQueryClient();
    const { UserID: userID, LevelID: levelID } = submission;

    function deleteSubmission(levelID?: number) {
        if (levelID === undefined) return;

        void toast.promise(DeleteSubmission(levelID, userID).then(() => {
            void queryClient.invalidateQueries(['level', levelID]);
            void queryClient.invalidateQueries(['user', userID, 'submissions']);
            close();
        }), {
            pending: 'Deleting...',
            success: 'Deleted your submission for ' + level.Meta.Name || `(${levelID})`,
            error: renderToastError,
        });
    }

    return (
        <Modal title='Delete submission' show={true} onClose={close}>
            <Modal.Body>
                <p>Are you sure you want to delete your submission for <b>{level.Meta.Name}</b> <span className={`py-1 px-2 rounded tier-${level.Rating?.toFixed(0) ?? '0'}`}>{level.Rating?.toFixed(0) ?? ' - '}</span> ?</p>
            </Modal.Body>
            <Modal.Footer>
                <div className='flex place-content-end gap-2'>
                    <SecondaryButton onClick={close}>Close</SecondaryButton>
                    <DangerButton onClick={() => deleteSubmission(levelID)}>Delete</DangerButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
}