import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PrimaryButton, SecondaryButton } from '../Button';
import Modal from '../Modal';
import { GetUserLists } from '../../api/v2/user';
import { List } from '../../pages/root/list/List';
import LoadingSpinner from '../LoadingSpinner';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import renderToastError from '../../utils/renderToastError';
import APIClient from '../../api/APIClient';

interface Props {
    show: boolean;
    onClose: () => void;
    userID: number;
    levelID: number;
}

async function AddLevelToList(levelID: number, listID: number) {
    await APIClient.post(`/v2/list/${listID}/add`, { levelID });
}

function ListItem({ userID, levelID, list }: { userID: number, levelID: number, list: Omit<List, 'Levels'> }) {
    const queryClient = useQueryClient();

    const onSubmit = useCallback(() => {
        const promise = AddLevelToList(levelID, list.ID).then(() => {
            queryClient.invalidateQueries(['user', userID, 'lists']);
        });

        toast.promise(promise, {
            pending: 'Adding...',
            success: 'Added level!',
            error: renderToastError,
        });
    }, [levelID, list.ID]);

    return (
        <li className='mt-4'>
            <PrimaryButton onClick={onSubmit}>Add to</PrimaryButton>
            <span> {list.Name}</span>
        </li>
    );
}

export default function AddLevelToListModal({ show, onClose, userID, levelID }: Props) {
    const { data: lists, status } = useQuery({
        queryKey: ['user', userID, 'lists', { order: 'Name' }],
        queryFn: () => GetUserLists(userID, 'Name'),
    });

    return (
        <Modal title='Add level to list' show={show} onClose={onClose} >
            <Modal.Body>{status === 'error' ? <p>An error occured, please try again later</p> : <>
                <ol className='my-6'>
                    {lists?.map((list) => (
                        <ListItem userID={userID} levelID={levelID} list={list} key={list.ID} />
                    ))}
                </ol>
                {lists?.length === 0 &&
                    <p>You don't have any lists yet.</p>
                }
                <LoadingSpinner isLoading={status === 'loading'} />
            </>
            }</Modal.Body>
            <Modal.Footer>
                <div className='flex float-right'>
                    <SecondaryButton onClick={onClose}>Close</SecondaryButton>
                </div>
            </Modal.Footer>
        </Modal>
    );
}