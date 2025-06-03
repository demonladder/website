import { useEffect, useId, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import FormGroup from '../../../components/form/FormGroup';
import FormInputLabel from '../../../components/form/FormInputLabel';
import { TextInput } from '../../../components/Input';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { validateUsername } from '../../../utils/validators/validateUsername';
import { UserResponse } from '../../../api/user/GetUser';
import TextArea from '../../../components/input/TextArea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveProfile } from '../../../features/settings/profile/api/saveProfile';
import renderToastError from '../../../utils/renderToastError';
import Heading3 from '../../../components/headings/Heading3';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';

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

    return (
        <section className='bg-theme-700 border border-theme-outline p-4 rounded-xl'>
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
                <p>ID: <b>{user.DiscordData?.ID}</b></p>
                <p>Username: <b>{user.DiscordData?.Username}</b></p>
                <p>Display name: <b>{user.DiscordData?.Name}</b></p>
                <SecondaryButton onClick={() => toast.warn('Not implemented yet')}>Un-link</SecondaryButton>
            </div>
        </section>
    );
}
