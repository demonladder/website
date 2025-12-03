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
import { Link } from 'react-router';
import { useAPI } from '../../../hooks/useAPI';

export default function AccountSettings() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [nameChallenge, setNameChallenge] = useState('');
    const session = useSession();
    const isNameValid = nameChallenge === session.user?.Name;
    const client = useAPI();

    const deleteUserMutation = useMutation({
        mutationFn: (ID: number) => DeleteUserRequest(client, ID),
        onSuccess: () => {
            window.location.href = '/';
        },
        onError: (error: Error) => void toast.error(renderToastError.render({ data: error })),
    });

    function onPasswordReset() {
        if (!session.user) return toast.error('You must be logged in to reset your password!');

        void toast.promise(forgotPassword(), {
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
                    <Heading3>Reset password</Heading3>
                    <SecondaryButton onClick={onPasswordReset}>Reset</SecondaryButton>
                </div>
                <FormInputDescription>Get sent a reset link on Discord.</FormInputDescription>
            </div>
            <section>
                <Heading3 className='mt-8 mb-4 border-b pb-2 border-theme-500'>Two-factor authentication</Heading3>
                <div className='flex gap-2 items-center'>
                    <i className='bx bx-mobile-alt text-2xl' />
                    <p>Use an authenticator app on your phone to generate a verification code.</p>
                    {session.has2FA
                        ? <Link to='/auth/totp/register' className='ms-auto'><SecondaryButton>Edit</SecondaryButton></Link>
                        : <Link to='/auth/totp/register' className='ms-auto'><SecondaryButton>Add</SecondaryButton></Link>
                    }
                </div>
            </section>
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
                        <DangerButton type='submit' disabled={!isNameValid} loading={deleteUserMutation.isPending}>Delete account</DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
