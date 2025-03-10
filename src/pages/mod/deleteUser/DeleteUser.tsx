import { useState } from 'react';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import WarningBox from '../../../components/message/WarningBox';
import renderToastError from '../../../utils/renderToastError';
import UserSearchBox from '../../../components/UserSearchBox';
import { TinyUser } from '../../../api/types/TinyUser';
import Modal from '../../../components/Modal';
import { useQueryClient } from '@tanstack/react-query';
import DeleteUserRequest from '../../../api/user/Delete';

export default function DeleteUser() {
    const [user, setUser] = useState<TinyUser>();
    const [showConfirm, setShowConfirm] = useState(false);

    const queryClient = useQueryClient();

    function submit() {
        if (user === undefined) return toast.error('Select a user first!');

        void toast.promise(DeleteUserRequest(user.ID).then(() => queryClient.invalidateQueries(['userSearch'])).finally(() => setShowConfirm(false)), {
            pending: 'Deleting user, this may take a while...',
            success: `Deleted ${user.Name}!`,
            error: renderToastError,
        });
    }

    function handleClick() {
        if (user === undefined) return toast.error('Select a user first!');

        setShowConfirm(true);
    }

    return (
        <div>
            <h3 className='text-2xl'>Delete User</h3>
            <p className='mb-3'>Delete a user and all its submissions</p>
            <WarningBox text={'Warning, this action is permanent.'} />
            <UserSearchBox id='deleteUserSearch' setResult={setUser} />
            <DangerButton onClick={handleClick}>Delete</DangerButton>
            <Modal title='Are you sure?' show={showConfirm} onClose={() => setShowConfirm(false)}>
                <Modal.Body>
                    <div className='my-6'>
                        <p>This is an irreversible action!</p>
                        <p>All submissions belonging to this user will be permanently deleted along with the user's information!</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex float-right round:gap-1'>
                        <PrimaryButton onClick={() => setShowConfirm(false)}>Cancel</PrimaryButton>
                        <DangerButton onClick={submit}>Confirm</DangerButton>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}