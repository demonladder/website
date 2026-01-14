import { toast } from 'react-toastify';
import { DangerButton } from '../ui/buttons/DangerButton';
import { SecondaryButton } from '../ui/buttons/SecondaryButton';
import Modal from '../layout/Modal';
import { useQueryClient } from '@tanstack/react-query';
import renderToastError from '../../utils/renderToastError';
import FormGroup from '../form/FormGroup';
import FormInputLabel from '../form/FormInputLabel';
import { TextInput } from '../shared/input/Input';
import { useId, useState } from 'react';
import DeletePendingSubmission from '../../api/submissions/DeletePendingSubmission';

interface Props {
    levelID: number;
    userID: number;
    submissionID: number;
    username: string;
    onClose: () => void;
}

export default function DeletePendingSubmissionModal({ userID, levelID, submissionID, username, onClose: close }: Props) {
    const [deleteReason, setDeleteReason] = useState('');
    const deleteInputID = useId();
    const queryClient = useQueryClient();

    function deleteSubmission(e: React.FormEvent) {
        e.preventDefault();

        void toast.promise(DeletePendingSubmission(submissionID, deleteReason).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['level', levelID] });
            void queryClient.invalidateQueries({ queryKey: ['user', userID, 'submissions', 'pending'] });
            close();
        }), {
            pending: 'Deleting...',
            success: 'Submission deleted ',
            error: renderToastError,
        });
    }

    return (
        <Modal title='Delete pending submission' show={true} onClose={close}>
            <p>Are you sure you want to delete <b>{username}s</b> pending submission?</p>
            <form onSubmit={deleteSubmission}>
                <FormGroup>
                    <FormInputLabel htmlFor={deleteInputID}>Reason</FormInputLabel>
                    <TextInput value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} id={deleteInputID} required minLength={1} />
                </FormGroup>
                <div className='flex place-content-end gap-2 mt-4'>
                    <SecondaryButton type='button' onClick={close}>Close</SecondaryButton>
                    <DangerButton type='submit'>Delete</DangerButton>
                </div>
            </form>
        </Modal>
    );
}
