import { useCallback, useState } from 'react';
import { DangerButton } from '../ui/buttons/DangerButton';
import { SecondaryButton } from '../ui/buttons/SecondaryButton';
import Modal from '../Modal';
import { toast } from 'react-toastify';
import DeleteList from '../../api/list/DeleteList';
import { useQueryClient } from '@tanstack/react-query';
import renderToastError from '../../utils/renderToastError';
import List from '../../api/types/List';
import { TextInput } from '../Input';
import { useNavigate } from 'react-router-dom';
import FormGroup from '../form/FormGroup';

interface Props {
    list: List;
    onClose: () => void;
}

export default function DeleteListModal({ list, onClose: close }: Props) {
    const queryClient = useQueryClient();
    const [listName, setListName] = useState('');

    const navigate = useNavigate();
    const deleteList = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        void toast.promise(DeleteList(list.ID).then(() => {
            void queryClient.invalidateQueries(['user', list.OwnerID, 'lists']);
            if (window.location.pathname.includes(`/list/${list.ID}`)) navigate(`/profile/${list.OwnerID}`);
            close();
        }), {
            pending: 'Deleting...',
            success: 'List deleted!',
            error: renderToastError,
        });
    }, [close, list.ID, list.OwnerID, navigate, queryClient]);

    // Prevent pasting
    function onListName(e: React.ChangeEvent<HTMLInputElement>) {
        const diff = e.target.value.length - listName.length;
        if (diff > 1) return;
        setListName(e.target.value);
    }

    return (
        <Modal title='Delete List' show={true} onClose={close}>
            <p>Are you sure you want to delete the list: "{list.Name}"?</p>
            <form onSubmit={deleteList}>
                <FormGroup>
                    <p className='mt-2'>Please type the lists name to continue (case sensitive):</p>
                    <TextInput value={listName} onChange={onListName} placeholder={list.Name} />
                </FormGroup>
                <div className='flex place-content-end gap-2 mt-4'>
                    <SecondaryButton type='button' onClick={close}>Close</SecondaryButton>
                    <DangerButton type='submit' disabled={list.Name !== listName}>Delete</DangerButton>
                </div>
            </form>
        </Modal>
    );
}
