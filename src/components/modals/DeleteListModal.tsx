import { useCallback } from 'react';
import { DangerButton } from '../ui/buttons/DangerButton';
import { SecondaryButton } from '../ui/buttons/SecondaryButton';
import Modal from '../Modal';
import { toast } from 'react-toastify';
import DeleteList from '../../api/list/DeleteList';
import { useQueryClient } from '@tanstack/react-query';
import renderToastError from '../../utils/renderToastError';
import List from '../../api/types/List';

interface Props {
    list: List;
    onClose: () => void;
}

export default function DeleteListModal({ list, onClose: close }: Props) {
    const queryClient = useQueryClient();

    const deleteList = useCallback((listID?: number) => {
        if (listID === undefined) return;

        void toast.promise(DeleteList(listID).then(() => {
            void queryClient.invalidateQueries(['user', list.OwnerID, 'lists']);
            if (window.location.pathname.includes(`/list/${listID}`)) window.location.replace(`/profile/${list.OwnerID}`);
            close();
        }), {
            pending: 'Deleting...',
            success: 'Deleted list!',
            error: renderToastError,
        });
    }, [close, list.OwnerID, queryClient]);

    return (
        <Modal title='Delete List' show={true} onClose={close}>
            <Modal.Body>
                <p>Are you sure you want to delete your list "{list.Name}"?</p>
            </Modal.Body>
            <Modal.Footer>
                <div className='flex place-content-end gap-2'>
                    <SecondaryButton onClick={close}>Close</SecondaryButton>
                    <DangerButton onClick={() => deleteList(list.ID)}>Delete</DangerButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
}