import { useState } from 'react';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import WarningBox from '../../../components/message/WarningBox';
import renderToastError from '../../../utils/renderToastError';
import UserSearchBox from '../../../components/shared/input/UserSearchBox';
import { TinyUser } from '../../../api/types/TinyUser';
import Modal from '../../../components/layout/Modal';
import { useQueryClient } from '@tanstack/react-query';
import DeleteUserRequest from '../../../api/user/Delete';
import FormGroup from '../../../components/form/FormGroup';
import { useAPI } from '../../../hooks/useAPI';

export default function DeleteUser() {
    const [user, setUser] = useState<TinyUser>();
    const [showConfirm, setShowConfirm] = useState(false);

    const queryClient = useQueryClient();
    const client = useAPI();

    function submit() {
        if (user === undefined) return toast.error('Select a user first!');

        void toast.promise(
            DeleteUserRequest(client, user.ID)
                .then(() => queryClient.invalidateQueries({ queryKey: ['userSearch'] }))
                .finally(() => setShowConfirm(false)),
            {
                pending: 'Deleting user, this may take a while...',
                success: `Deleted ${user.Name}!`,
                error: renderToastError,
            },
        );
    }

    function handleClick() {
        if (user === undefined) return toast.error('Select a user first!');

        setShowConfirm(true);
    }

    return (
        <div>
            <h3 className='text-2xl'>Delete User</h3>
            <p>Delete a user and all their submissions and lists!</p>
            <p>
                Are you sure this action is necessary? Banning a user and purging their submissions keep that users
                account linked to their Discord.
            </p>
            <WarningBox>This action is permanent.</WarningBox>
            <FormGroup>
                <UserSearchBox id='deleteUserSearch' setResult={setUser} />
                <DangerButton onClick={handleClick} disabled={!user}>
                    Delete
                </DangerButton>
            </FormGroup>
            <Modal title='Are you sure?' show={showConfirm} onClose={() => setShowConfirm(false)}>
                <div className='my-6'>
                    <p>This is an irreversible action!</p>
                    <p>
                        All submissions belonging to this user will be permanently deleted along with the user's
                        information!
                    </p>
                </div>
                <div className='flex float-right round:gap-1'>
                    <PrimaryButton onClick={() => setShowConfirm(false)}>Cancel</PrimaryButton>
                    <DangerButton onClick={submit}>Confirm</DangerButton>
                </div>
            </Modal>
        </div>
    );
}
