import { Link, useLoaderData } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner';
import Level from './components/Level';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { moveListLevel } from './api/moveListLevel';
import renderToastError from '../../utils/renderToastError';
import useDeleteListModal from '../../hooks/modals/useDeleteListModal';
import useSession from '../../hooks/useSession';
import Page from '../../components/Page';
import { editListName } from './api/editListName';
import { PermissionFlags } from '../admin/roles/PermissionFlags';
import Heading1 from '../../components/headings/Heading1';
import TextArea from '../../components/input/TextArea';
import FilledButton from '../../components/input/buttons/filled/FilledButton';
import { editListDescription } from './api/editListDescription';
import { AxiosError } from 'axios';
import { useList } from './hooks/useList';
import TonalButton from '../../components/input/buttons/tonal/TonalButton';
import { type List } from './types/List';

export default function List() {
    const loadedData = useLoaderData<List>();
    const listID = loadedData.ID;
    const [isDragLocked, setIsDragLocked] = useState(false);
    const [name, setName] = useState(loadedData.Name);
    const [description, setDescription] = useState(loadedData.Description ?? '');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const openDeleteModal = useDeleteListModal();
    const session = useSession();

    const queryClient = useQueryClient();

    const { data: list, status } = useList(listID);

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

    const saveDescriptionMutation = useMutation({
        mutationFn: ([listID, description]: [number, string | null]) => editListDescription(listID, description),
        onMutate: ([_, description]) => {
            setIsEditingDescription(false);
            const oldDescription = list?.Description;
            if (list) list.Description = description;
            return oldDescription;
        },
        onSuccess: (newList) => {
            if (list) list.Description = newList.Description;
            setDescription(newList.Description ?? '');
            toast.success('Description saved');
        },
        onError: (error: AxiosError, _, context) => {
            toast.error(renderToastError.render({ data: error }));
            if (list) list.Description = context ?? null;
            setIsEditingDescription(true);
        },
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

    function onSaveDescription() {
        if (description.length === 0) return saveDescriptionMutation.mutate([listID, null]);
        if (!/^[a-zA-Z0-9\s.&,'_-]+$/.test(description)) return toast.error('Description can only contain letters, numbers, spaces, , . _ - & \'');
        saveDescriptionMutation.mutate([listID, description]);
    }

    function onCancelDescription() {
        setIsEditingDescription(false);
        setDescription(list?.Description ?? '');
    }

    if (status === 'error') return <Page><Heading1>404: List not found</Heading1></Page>;
    if (status === 'pending') return <Page><Heading1><LoadingSpinner /></Heading1></Page>;

    return (
        <Page title={`GDDL | List | ${list.Name}`}>
            {!isEditingName
                ? <Heading1 onClick={onNameClicked}>{list.Name} {canEdit && <i className='bx bxs-pencil cursor-text' />}</Heading1>
                : <form onSubmit={onSaveName}><input type='text' value={name} onChange={(e) => setName(e.target.value)} className='text-4xl font-bold block w-full outline-none' autoFocus onBlur={onSaveName} /></form>
            }
            <h2 className='text-2xl'>by <Link to={`/profile/${list.OwnerID}`} className='text-blue-400 underline'>{list.Owner.Name}</Link></h2>
            {description && !isEditingDescription &&
                <h3 className='my-2 text-lg' onClick={() => setIsEditingDescription(true)}>{description} {canEdit && <i className='bx bxs-pencil cursor-text' />}</h3>
            }
            {!isEditingDescription && !description && canEdit &&
                <p className='italic text-theme-400' onClick={() => setIsEditingDescription(true)}>Click to add a description</p>
            }
            {isEditingDescription &&
                <>
                    <TextArea value={description} onChange={(e) => setDescription(e.target.value)} autoFocus />
                    <div className='mt-2 flex gap-1 justify-end'>
                        <TonalButton size='sm' onClick={onCancelDescription}>Cancel</TonalButton>
                        <FilledButton onClick={onSaveDescription}>Save</FilledButton>
                    </div>
                </>
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
