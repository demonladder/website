import { useEffect, useId, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import FormGroup from '../../../../components/form/FormGroup';
import FormInputLabel from '../../../../components/form/FormInputLabel';
import { TextInput } from '../../../../components/shared/input/Input';
import { PrimaryButton } from '../../../../components/ui/buttons/PrimaryButton';
import { validateUsername } from '../../../../utils/validators/validateUsername';
import { UserResponse } from '../../../../api/user/GetUser';
import TextArea from '../../../../components/input/TextArea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveProfile } from '../../../settings/profile/api/saveProfile';
import renderToastError from '../../../../utils/renderToastError';
import { Heading3 } from '../../../../components/headings';
import { SecondaryButton } from '../../../../components/ui/buttons/SecondaryButton';
import { unlinkUserDiscord } from '../api/unlinkUserDiscord';

export default function EditInformation({ user }: { user: UserResponse }) {
    const nameID = useId();
    const introductionID = useId();
    const [newName, setNewName] = useState<string>(user.Name);
    const [newIntroduction, setNewIntroduction] = useState<string>(user.Introduction ?? '');

    const isChanged = useMemo(() => {
        return user.Name !== newName || (user.Introduction ?? '') !== newIntroduction;
    }, [newName, newIntroduction, user.Introduction, user.Name]);

    useEffect(() => {
        setNewName(user.Name);
        setNewIntroduction(user.Introduction ?? '');
    }, [user]);

    const queryClient = useQueryClient();
    const editMutation = useMutation({
        mutationFn: (body: Parameters<typeof saveProfile>[0]) => toast.promise(saveProfile(body), { pending: 'Saving...', success: 'Saved', error: renderToastError }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['user', user.ID] });
            void queryClient.invalidateQueries({ queryKey: ['userSearch'] });
        },
    });

    function submitHandler(e: React.FormEvent) {
        e.preventDefault();
        editMutation.mutate({ ID: user.ID, name: newName, introduction: newIntroduction });
    }

    const unlinkMutation = useMutation({
        mutationFn: unlinkUserDiscord,
    });
    function handleUnlink() {
        const handle = toast.loading('Unlinking...');
        unlinkMutation.mutate(user.ID, {
            onSuccess: () => toast.update(handle, { render: 'Account unlinked', type: 'success', isLoading: false, autoClose: 3000 }),
            onError: (err) => toast.update(handle, { render: renderToastError.render({ data: err }), type: 'error', isLoading: false, autoClose: 3000 }),
        });
    }

    return (
        <section className='bg-theme-700 border border-theme-outline p-4 round:rounded-xl'>
            <Heading3>Edit information</Heading3>
            <form className='mt-4' onSubmit={submitHandler}>
                <FormGroup>
                    <FormInputLabel htmlFor={nameID}>Name</FormInputLabel>
                    <TextInput id={nameID} className='border p-2' value={newName} onChange={(e) => setNewName(e.target.value)} invalid={!validateUsername(newName)} />
                </FormGroup>
                <FormGroup>
                    <FormInputLabel htmlFor={introductionID}>Introduction</FormInputLabel>
                    <TextArea id={introductionID} className='border p-2' value={newIntroduction} onChange={(e) => setNewIntroduction(e.target.value)} invalid={!validateUsername(newName)} />
                </FormGroup>
                <div className='flex justify-between'>
                    <PrimaryButton type='submit' disabled={!isChanged}>Save</PrimaryButton>
                    <p>{newIntroduction.length}/500</p>
                </div>
            </form>
            <div>
                <Heading3 className='mt-4'>Discord link</Heading3>
                {user.Account
                    ? <>
                        <p>ID: <b>{user.Account.ID}</b></p>
                        <p>Username: <b>{user.Account.discordUsername}</b></p>
                    </>
                    : <p>User's profile is not linked to any Discord account!</p>
                }
                <SecondaryButton onClick={() => handleUnlink()}>Un-link</SecondaryButton>
            </div>
        </section>
    );
}
