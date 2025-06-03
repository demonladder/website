import { useCallback, useState } from 'react';
import { SecondaryButton } from '../ui/buttons/SecondaryButton';
import { PrimaryButton } from '../ui/buttons/PrimaryButton';
import { TextInput } from '../Input';
import Modal from '../Modal';
import { createList } from '../../features/list/api/createList';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import renderToastError from '../../utils/renderToastError';
import FormGroup from '../form/FormGroup';
import FormInputLabel from '../form/FormInputLabel';
import FormInputDescription from '../form/FormInputDescription';

interface Props {
    userID: number;
    levelID: number;
    onClose: () => void;
}

export default function CreateListModal({ userID, levelID, onClose: close }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const queryClient = useQueryClient();

    const onCreateList = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const promise = createList(title, levelID, description).then(() => {
            close();
            return queryClient.invalidateQueries({ queryKey: ['user', userID, 'lists'] });
        });

        void toast.promise(promise, {
            pending: 'Creating...',
            success: 'List created!',
            error: renderToastError,
        });
    }, [title, description, close, levelID, queryClient, userID]);

    return (
        <Modal title='Create list' show={true} onClose={close}>
            <form onSubmit={onCreateList}>
                <FormGroup>
                    <FormInputLabel>Title</FormInputLabel>
                    <TextInput value={title} onChange={(e) => setTitle(e.target.value.trimStart())} invalid={!title.match(/^[a-zA-Z0-9\s._-]{3,32}$/)} minLength={3} maxLength={32} required />
                    <FormInputDescription>3-32 characters. Allowed characters: a-Z 0-9 spaces . _ -</FormInputDescription>
                </FormGroup>
                <FormGroup>
                    <FormInputLabel>Description</FormInputLabel>
                    <TextInput value={description} onChange={(e) => setDescription(e.target.value)} />
                </FormGroup>
                <FormGroup className='flex float-right gap-2'>
                    <SecondaryButton type='button' onClick={close}>Close</SecondaryButton>
                    <PrimaryButton type='submit'>Create</PrimaryButton>
                </FormGroup>
            </form>
        </Modal>
    );
}
