import { useCallback, useState } from 'react';
import { DangerButton } from '../ui/buttons/DangerButton';
import { SecondaryButton } from '../ui/buttons/SecondaryButton';
import Modal from '../layout/Modal';
import { toast } from 'react-toastify';
import { deleteList } from '../../features/list/api/deleteList';
import { useQueryClient } from '@tanstack/react-query';
import renderToastError from '../../utils/renderToastError';
import { List } from '../../features/list/types/List';
import { TextInput } from '../shared/input/Input';
import { useNavigate } from 'react-router';
import FormGroup from '../form/FormGroup';

interface Props {
    list: Pick<List, 'ID' | 'Name' | 'OwnerID'>;
    onClose: () => void;
}

export default function DeleteListModal({ list, onClose: close }: Props) {
    const queryClient = useQueryClient();
    const [listName, setListName] = useState('');

    const navigate = useNavigate();
    const onDeleteList = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        void toast.promise(deleteList(list.ID).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['user', list.OwnerID, 'lists'] });
            if (window.location.pathname.includes(`/list/${list.ID}`)) void navigate(`/profile/${list.OwnerID}`);
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
            <form onSubmit={onDeleteList}>
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
