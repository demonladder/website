import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SecondaryButton } from '../ui/buttons/SecondaryButton';
import { PrimaryButton } from '../ui/buttons/PrimaryButton';
import Modal from '../Modal';
import GetUserLists from '../../api/user/GetUserLists';
import List from '../../api/types/List';
import LoadingSpinner from '../LoadingSpinner';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import renderToastError from '../../utils/renderToastError';
import useCreateListModal from '../../hooks/modals/useCreateListModal';
import addLevelToList from '../../api/list/addLevelToList';

interface Props {
    onClose: () => void;
    userID: number;
    levelID: number;
}

function ListItem({ userID, levelID, list, onClose: close }: { userID: number, levelID: number, list: List, onClose: () => void }) {
    const queryClient = useQueryClient();

    const onSubmit = useCallback(() => {
        const promise = addLevelToList(levelID, list.ID).then(() => {
            void queryClient.invalidateQueries(['user', userID, 'lists']);
            void queryClient.invalidateQueries(['list', list.ID]);
            close();
        });

        void toast.promise(promise, {
            pending: 'Adding...',
            success: 'Added level!',
            error: renderToastError,
        });
    }, [close, levelID, list.ID, queryClient, userID]);

    return (
        <li className='mt-4'>
            <span> {list.Name}</span>
            <PrimaryButton onClick={onSubmit} className='float-right'>Add</PrimaryButton>
        </li>
    );
}

export default function AddLevelToListModal({ onClose, userID, levelID }: Props) {
    const { data: lists, status } = useQuery({
        queryKey: ['user', userID, 'lists', { order: 'Name' }],
        queryFn: () => GetUserLists(userID, 'Name'),
    });

    const openCreateListModal = useCreateListModal();

    return (
        <Modal title='Add level to list' show={true} onClose={onClose}>
            <div>{status === 'error'
                ? <p>An error occured, please try again later</p>
                : <>
                    <ol className='my-6'>
                        {lists?.map((list) => (
                            <ListItem userID={userID} levelID={levelID} list={list} onClose={onClose} key={list.ID} />
                        ))}
                    </ol>
                    {lists?.length === 0 &&
                        <p>You don't have any lists yet.</p>
                    }
                    <PrimaryButton onClick={() => openCreateListModal(userID, levelID)}>Create new list</PrimaryButton>
                    <LoadingSpinner isLoading={status === 'loading'} />
                </>
            }</div>
            <div className='flex float-right'>
                <SecondaryButton onClick={onClose}>Close</SecondaryButton>
            </div>
        </Modal>
    );
}
