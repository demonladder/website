import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import FormInputDescription from '../../../components/form/FormInputDescription';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import FormGroup from '../../../components/form/FormGroup';
import Modal from '../../../components/Modal';
import React, { useState } from 'react';
import { TextInput } from '../../../components/Input';
import useSession from '../../../hooks/useSession';
import { toast } from 'react-toastify';
import DeleteUserRequest from '../../../api/user/Delete';
import { useMutation } from '@tanstack/react-query';
import renderToastError from '../../../utils/renderToastError';
import Heading1 from '../../../components/headings/Heading1';
import { forgotPassword } from '../../../api/auth/forgotPassword';
import Heading3 from '../../../components/headings/Heading3';

export default function AccountSettings() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [nameChallenge, setNameChallenge] = useState('');
    const session = useSession();
    const isNameValid = nameChallenge === session.user?.Name;

    const deleteUserMutation = useMutation({
        mutationFn: DeleteUserRequest,
        onSuccess: () => {
            window.location.href = '/';
        },
        onError: (error: Error) => toast.error(renderToastError.render({ data: error })),
    });

    function onPasswordReset() {
        const name = session.user?.DiscordData?.Username;
        if (!name) return toast.error('You must be logged in to reset your password!');

        void toast.promise(forgotPassword(name), {
            pending: 'Sending password reset link...',
            success: 'Password reset link sent!',
            error: renderToastError,
        });
    }

    function onDelete(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!session.user) return toast.error('You must be logged in to delete your account!');

        deleteUserMutation.mutate(session.user.ID);
    }

    return (
        <section>
            <Heading1 className='mb-4'>Account settings</Heading1>
            <div>
                <div className='flex justify-between border-theme-500 border-b pb-2'>
                    <Heading3>Password</Heading3>
                    <SecondaryButton onClick={onPasswordReset}>Reset</SecondaryButton>
                </div>
                <FormInputDescription>Get sent a reset link on Discord.</FormInputDescription>
            </div>
            <div className='mt-12'>
                <div className='flex justify-between border-theme-500 border-b pb-2'>
                    <Heading3>Delete account</Heading3>
                    <DangerButton onClick={() => setShowDeleteModal(true)} disabled={!session.user}>Delete</DangerButton>
                </div>
                <FormInputDescription>This action is irreversible! All related data to your account will be deleted.</FormInputDescription>
            </div>
            <Modal title='Delete account' show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <form onSubmit={onDelete}>
                    <div>
                        <p>Are you sure you want to delete your account?</p>
                        <p>This action is irreversible! All related data to your account will be deleted.</p>
                        <FormGroup>
                            <TextInput name='deleteUserChallenge' value={nameChallenge} onChange={(e) => setNameChallenge(e.target.value)} placeholder='Type your username to confirm' invalid={!isNameValid} autoComplete='off' />
                            <FormInputDescription>Enter your username to confirm the deletion of your account.</FormInputDescription>
                        </FormGroup>
                    </div>
                    <div className='flex justify-end'>
                        <DangerButton type='submit' disabled={!isNameValid} loading={deleteUserMutation.isLoading}>Delete account</DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
