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
import SaveProfile from '../../../api/user/SaveProfile';
import renderToastError from '../../../utils/renderToastError';

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
        mutationFn: () => toast.promise(SaveProfile(user.ID, { name: newName, introduction: newIntroduction }), { pending: 'Saving...', success: 'Saved', error: renderToastError }),
        onSuccess: () => {
            void queryClient.invalidateQueries(['user', user.ID]);
            void queryClient.invalidateQueries(['userSearch']);
        },
    });

    function submitHandler(e: React.FormEvent) {
        e.preventDefault();
        editMutation.mutate();
    }

    return (
        <form className='mt-4' onSubmit={submitHandler}>
            <h3 className='text-xl'>Edit information</h3>
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
    );
}