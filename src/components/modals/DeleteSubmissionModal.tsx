import { toast } from 'react-toastify';
import { DangerButton } from '../ui/buttons/DangerButton';
import { SecondaryButton } from '../ui/buttons/SecondaryButton';
import Modal from '../Modal';
import DeleteSubmission from '../../api/submissions/DeleteSubmission';
import { useQueryClient } from '@tanstack/react-query';
import renderToastError from '../../utils/renderToastError';
import Submission from '../../api/types/Submission';
import LevelMeta from '../../features/level/types/LevelMeta';
import Level from '../../features/level/types/Level';
import User from '../../api/types/User';

interface Props {
    level: Level & { Meta: LevelMeta };
    submission: Submission & { User: User };
    onClose: () => void;
}

export default function DeleteSubmissionModal({ level, submission, onClose: close }: Props) {
    const queryClient = useQueryClient();
    const { UserID: userID, LevelID: levelID } = submission;

    function deleteSubmission() {
        void toast.promise(DeleteSubmission(submission.ID).then(() => {
            void queryClient.invalidateQueries(['level', levelID]);
            void queryClient.invalidateQueries(['user', userID, 'submissions']);
            close();
        }), {
            pending: 'Deleting...',
            success: 'Deleted a submission for ' + level.Meta.Name,
            error: renderToastError,
        });
    }

    return (
        <Modal title='Delete submission' show={true} onClose={close}>
            <p>Are you sure you want to delete <b>{submission.User.Name}s</b> submission for <b>{level.Meta.Name}</b> <span className={`py-1 px-2 rounded tier-${level.Rating?.toFixed(0) ?? '0'}`}>{level.Rating?.toFixed(0) ?? ' - '}</span> ?</p>
            <div className='flex place-content-end gap-2 mt-4'>
                <SecondaryButton onClick={close}>Close</SecondaryButton>
                <DangerButton onClick={() => deleteSubmission()}>Delete</DangerButton>
            </div>
        </Modal>
    );
}
