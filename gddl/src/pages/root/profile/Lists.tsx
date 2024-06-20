import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import NewLabel from '../../../components/NewLabel';
import StorageManager from '../../../utils/StorageManager';
import { DangerButton, PrimaryButton, SecondaryButton } from '../../../components/Button';
import { useCallback, useState } from 'react';
import Modal from '../../../components/Modal';
import { TextInput } from '../../../components/Input';
import { toast } from 'react-toastify';
import renderToastError from '../../../utils/renderToastError';
import GetUserLists from '../../../api/v2/user/user';
import DeleteList from '../../../api/v2/list/DeleteList';
import CreateList from '../../../api/v2/list/CreateList';
import { useContextMenu } from '../../../components/ui/menuContext/MenuContextContainer';
import List from '../../../api/types/List';

interface Props {
    userID: number;
}

export default function Lists({ userID }: Props) {
    const [showCreationModal, setShowCreationModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [clickedList, setClickedList] = useState<List>();
    const [showDeleteListModal, setShowDeleteListModal] = useState(false);
    const navigate = useNavigate();

    const lookingAtOwnPage = userID === StorageManager.getUser()?.ID;

    const queryClient = useQueryClient();
    const { data: lists } = useQuery({
        queryKey: ['user', userID, 'lists'],
        queryFn: () => GetUserLists(userID),
    });

    const { createMenu } = useContextMenu();

    const openContext = useCallback((e: React.MouseEvent, list: List) => {
        if (userID !== StorageManager.getUser()?.ID) return;

        e.preventDefault();

        setClickedList(list);
        createMenu({
            x: e.clientX,
            y: e.clientY,
            buttons: [
                { text: 'Info', onClick: () => navigate(`/list/${list.ID}`) },
                { text: 'Delete', type: 'danger', onClick: () => setShowDeleteListModal(true) },
            ],
        })
    }, []);

    const createList = useCallback(() => {
        const promise = CreateList(title, description).then(() => {
            setShowCreationModal(false);
            queryClient.invalidateQueries(['user', userID, 'lists']);
        });

        toast.promise(promise, {
            pending: 'Creating...',
            success: 'List created!',
            error: renderToastError,
        });
    }, [title, description]);

    const deleteList = useCallback((listID?: number) => {
        if (listID === undefined) return;

        toast.promise(DeleteList(listID).then(() => {
            queryClient.invalidateQueries(['user', userID, 'lists']);
            setShowDeleteListModal(false);
        }), {
            pending: 'Deleting...',
            success: 'Deleted list!',
            error: renderToastError,
        });
    }, []);

    return (
        <section>
            <h2 className='text-3xl mt-6' id='lists'>Lists <NewLabel ID='lists' /></h2>
            {lookingAtOwnPage && <PrimaryButton onClick={() => setShowCreationModal(true)}>Create new list</PrimaryButton>}
            {(lists?.length ?? 0) > 0
                ? (
                    <table className='w-full text-xl my-2'>
                        <thead>
                            <tr className='text-2xl border-b-2'>
                                <th className='text-start'><p className='ps-2'>Name</p></th>
                                <th className='text-start'>Description</th>
                                <th>Median tier</th>
                                <th>Average tier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lists?.map((list) => (
                                <tr className='bg-gray-700' key={list.ID} onContextMenu={(e) => openContext(e, list)}>
                                    <td><Link to={`/list/${list.ID}`} className='block py-1 ps-2 my-2'>{list.Name}</Link></td>
                                    <td><p>{list.Description?.slice(0, 64).trim().concat(list.Description.length > 64 ? '...' : '') ?? <i className='text-gray-300'>No description</i>}</p></td>
                                    <td className={'text-center tier-' + list.MedianTier}>
                                        {!list.MedianTier
                                            ? <p><i>N/A</i></p>
                                            : <p><b>{list.MedianTier}</b></p>
                                        }
                                    </td>
                                    <td className={'text-center tier-' + list.AverageTier?.toFixed()}>
                                        {!list.AverageTier
                                            ? <p><i>N/A</i></p>
                                            : <p><b>{list.AverageTier.toFixed(2)}</b></p>
                                        }</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (lookingAtOwnPage
                    ? (
                        <p><i>You have not created any lists</i></p>
                    )
                    : (
                        <p><i>This user has not created any lists yet</i></p>
                    )
                )
            }
            <Modal title='Create list' show={showCreationModal} onClose={() => setShowCreationModal(false)}>
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
                        <SecondaryButton onClick={() => setShowCreationModal(false)}>Close</SecondaryButton>
                        <PrimaryButton onClick={createList}>Create</PrimaryButton>
                    </div>
                </Modal.Footer>
            </Modal>
            <Modal title='Delete List' show={showDeleteListModal} onClose={() => setShowDeleteListModal(false)}>
                <Modal.Body>
                    <p>Are you sure you want to delete your list "{clickedList?.Name}"?</p>
                </Modal.Body>
                <Modal.Footer>
                    <div className='flex place-content-end gap-2'>
                        <SecondaryButton onClick={() => setShowDeleteListModal(false)}>Close</SecondaryButton>
                        <DangerButton onClick={() => deleteList(clickedList?.ID)}>Delete</DangerButton>
                    </div>
                </Modal.Footer>
            </Modal>
        </section>
    );
}