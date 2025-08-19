import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner';
import Level from './components/Level';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getList } from './api/getList';
import { moveListLevel } from './api/moveListLevel';
import renderToastError from '../../utils/renderToastError';
import useDeleteListModal from '../../hooks/modals/useDeleteListModal';
import useSession from '../../hooks/useSession';
import Page from '../../components/Page';
import { editListName } from './api/editListName';
import { PermissionFlags } from '../admin/roles/PermissionFlags';
import Heading1 from '../../components/headings/Heading1';

export default function List() {
    const listID = parseInt(useParams().listID ?? '');
    const validListID = !isNaN(listID);
    const [isDragLocked, setIsDragLocked] = useState(false);
    const [name, setName] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);

    const openDeleteModal = useDeleteListModal();
    const session = useSession();

    const queryClient = useQueryClient();

    const { data: list, status } = useQuery({
        queryKey: ['list', listID],
        queryFn: () => getList(listID),
        enabled: validListID,
    });

    useEffect(() => {
        if (list) setName(list.Name);
    }, [list]);

    const setPosition = useCallback((oldPosition: number, newPosition: number) => {
        if (oldPosition === newPosition) return;

        const oldID = list?.Levels.find((l) => l.Position === oldPosition)?.LevelID;
        if (!oldID) return;

        setIsDragLocked(true);

        void toast.promise(
            moveListLevel(list.ID, oldID, newPosition).then(() => queryClient.invalidateQueries({ queryKey: ['list', listID] })).finally(() => setIsDragLocked(false)),
            {
                success: 'Moved level',
                pending: 'Moving...',
                error: renderToastError,
            },
        );
    }, [list, listID, queryClient, setIsDragLocked]);

    const nameMutation = useMutation({
        mutationFn: ([listID, name]: [number, string]) => editListName(listID, name),
    });

    function onSaveName(e: React.SyntheticEvent) {
        e.preventDefault();
        setIsEditingName(false);

        if (name !== list?.Name) nameMutation.mutate([listID, name], {
            onSuccess: () => {
                if (list) list.Name = name;
                toast.success('List name updated');
            },
        });
    }

    const canEdit = session.user?.ID === list?.OwnerID || session.hasPermission(PermissionFlags.MANAGE_LISTS);
    function onNameClicked() {
        if (!canEdit) return;
        setIsEditingName(true);
    }

    if (!validListID || (status === 'error' && list === undefined)) return <Page><Heading1>404: List not found</Heading1></Page>;
    if (status === 'pending') return <Page><Heading1><LoadingSpinner /></Heading1></Page>;

    return (
        <Page>
            <title>GDDL | List | {list.Name}</title>
            {!isEditingName
                ? <Heading1 onClick={onNameClicked}>{list.Name} {canEdit && <i className='bx bxs-pencil cursor-text' />}</Heading1>
                : <form onSubmit={onSaveName}><input type='text' value={name} onChange={(e) => setName(e.target.value)} className='text-4xl font-bold block w-full outline-none' autoFocus onBlur={onSaveName} /></form>
            }
            <h2 className='text-2xl'>by <Link to={`/profile/${list.OwnerID}`} className='text-blue-400 underline'>{list.Owner.Name}</Link></h2>
            {list.Description &&
                <h3 className='my-2 text-lg'>{list.Description}</h3>
            }
            {!list.Description && canEdit &&
                <p className='italic text-theme-400'>Click to add a description</p>
            }
            <ol className='mt-4'>
                {list.Levels.map((level) => <Level list={list} listLevel={level} setPosition={setPosition} dragLocked={isDragLocked} key={level.LevelID} />)}
            </ol>
            {list.Levels.length === 0 && (
                <p><i>This list doesn't have any levels yet</i></p>
            )}
            {list.OwnerID === session.user?.ID &&
                <button onClick={() => openDeleteModal(list)} className='mt-4 text-red-500 underline-t'>Delete list</button>
            }
        </Page>
    );
}
