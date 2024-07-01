import { useCallback, useState } from 'react';
import { PrimaryButton, SecondaryButton } from '../Button';
import { TextInput } from '../Input';
import Modal from '../Modal';
import CreateList from '../../api/list/CreateList';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import renderToastError from '../../utils/renderToastError';

interface Props {
    userID: number;
    onClose: () => void;
}

export default function CreateListModal({ userID, onClose: close }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const queryClient = useQueryClient();

    const createList = useCallback(() => {
        const promise = CreateList(title, description).then(() => {
            close();
            queryClient.invalidateQueries(['user', userID, 'lists']);
        });

        toast.promise(promise, {
            pending: 'Creating...',
            success: 'List created!',
            error: renderToastError,
        });
    }, [title, description]);

    return (
        <Modal title='Create list' show={true} onClose={close}>
            <Modal.Body>
                <div>
                    <p>Title</p>
                    <TextInput value={title} onChange={(e) => setTitle(e.target.value.trimStart())} invalid={!title.match(/^[a-zA-Z0-9\s\._-]{3,32}$/)} />
                </div>
                <div className='mt-2'>
                    <p>Description</p>
                    <TextInput value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='flex float-right'>
                    <SecondaryButton onClick={close}>Close</SecondaryButton>
                    <PrimaryButton onClick={createList}>Create</PrimaryButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
}