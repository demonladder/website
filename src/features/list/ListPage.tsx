import { Link, useLoaderData } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Level from './components/Level';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { moveListLevel } from './api/moveListLevel';
import renderToastError from '../../utils/renderToastError';
import useDeleteListModal from '../../hooks/modals/useDeleteListModal';
import useSession from '../../hooks/useSession';
import Page from '../../components/layout/Page';
import { editListName } from './api/editListName';
import { PermissionFlags } from '../admin/roles/PermissionFlags';
import { Heading1 } from '../../components/headings';
import TextArea from '../../components/input/TextArea';
import { PrimaryButton } from '../../components/ui/buttons/PrimaryButton';
import { editListDescription } from './api/editListDescription';
import { AxiosError } from 'axios';
import { useList } from './hooks/useList';
import { SecondaryButton } from '../../components/ui/buttons/SecondaryButton';
import { type List } from './types/List';
import { Progress } from './components/Progress.tsx';
import { List as ListIcon, ListUl } from '@boxicons/react';

export default function List() {
    const loadedData = useLoaderData<List>();
    const listID = loadedData.ID;
    const [isDragLocked, setIsDragLocked] = useState(false);
    const [name, setName] = useState(loadedData.Name);
    const [description, setDescription] = useState(loadedData.Description ?? '');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isCompact, setIsCompact] = useState(false);

    const openDeleteModal = useDeleteListModal();
    const session = useSession();

    const queryClient = useQueryClient();

    const { data: list, status } = useList(listID);
    const completedCount = list?.Levels.reduce((acc, cur) => acc + cur.Level.completed, 0) ?? 0;

    const setPosition = useCallback(
        (oldPosition: number, newPosition: number) => {
            if (oldPosition === newPosition) return;

            const oldID = list?.Levels.find((l) => l.Position === oldPosition)?.LevelID;
            if (!oldID) return;

            setIsDragLocked(true);

            void toast.promise(
                moveListLevel(list.ID, oldID, newPosition)
                    .then(() => queryClient.invalidateQueries({ queryKey: ['list', listID] }))
                    .finally(() => setIsDragLocked(false)),
                {
                    success: 'Moved level',
                    pending: 'Moving...',
                    error: renderToastError,
                },
            );
        },
        [list, listID, queryClient, setIsDragLocked],
    );

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

        if (name !== list?.Name)
            nameMutation.mutate([listID, name], {
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
        if (!/^[a-zA-Z0-9\s.&,'*!?_-]+$/.test(description))
            return toast.error(
                "Description can only contain these allowed characters: letters, numbers, spaces, , . ! ? _ - & ' *",
            );
        saveDescriptionMutation.mutate([listID, description]);
    }

    function onCancelDescription() {
        setIsEditingDescription(false);
        setDescription(list?.Description ?? '');
    }

    if (status === 'error')
        return (
            <Page>
                <Heading1>404: List not found</Heading1>
            </Page>
        );
    if (status === 'pending')
        return (
            <Page>
                <Heading1>
                    <LoadingSpinner />
                </Heading1>
            </Page>
        );

    return (
        <Page title={`List | ${list.Name}`}>
            {!isEditingName ? (
                <Heading1 onClick={onNameClicked}>
                    {list.Name} {canEdit && <i className='bx bxs-pencil cursor-text' />}
                </Heading1>
            ) : (
                <form onSubmit={onSaveName}>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='text-4xl font-bold block w-full outline-none'
                        autoFocus
                        onBlur={onSaveName}
                    />
                </form>
            )}
            <h2 className='text-2xl'>
                by{' '}
                <Link to={`/profile/${list.OwnerID}`} className='text-blue-400 underline'>
                    {list.Owner.Name}
                </Link>
            </h2>
            {description && !isEditingDescription && (
                <h3 className='my-2 text-lg' onClick={() => setIsEditingDescription(true)}>
                    {description} {canEdit && <i className='bx bxs-pencil cursor-text' />}
                </h3>
            )}
            {!isEditingDescription && !description && canEdit && (
                <p className='italic text-theme-400' onClick={() => setIsEditingDescription(true)}>
                    Click to add a description
                </p>
            )}
            {isEditingDescription && (
                <>
                    <TextArea value={description} onChange={(e) => setDescription(e.target.value)} autoFocus />
                    <div className='mt-2 flex gap-1 justify-end'>
                        <SecondaryButton onClick={onCancelDescription}>Cancel</SecondaryButton>
                        <PrimaryButton onClick={onSaveDescription}>Save</PrimaryButton>
                    </div>
                </>
            )}
            <Progress completed={completedCount} total={list.Levels.length} />
            <div className='flex justify-between'>
                <div></div>
                <div>
                    <button
                        className='text-theme-400 hover:text-theme-text transition-colors'
                        onClick={() => setIsCompact((prev) => !prev)}
                    >
                        {isCompact ? (
                            <>
                                Compact <ListIcon className='inline-block -mt-1' />
                            </>
                        ) : (
                            <>
                                List <ListUl className='inline-block -mt-1' />
                            </>
                        )}
                    </button>
                </div>
            </div>
            {isCompact ? (
                <ol className='lg:text-lg mt-4 grid' style={{ gridTemplateColumns: '2rem max-content 1fr auto auto' }}>
                    <div className='grid grid-cols-subgrid col-span-5'>
                        <p className='text-right text-theme-300'>#</p>
                        <p className='text-theme-300 ps-10'>Name</p>
                        <p className='text-theme-300 ps-10'>Creator</p>
                        <p className='text-theme-300 ps-10 text-center'>Tier</p>
                        <p className='text-theme-300 text-center'>Enj.</p>
                    </div>
                    <div className='border-b border-theme-400 h-px col-span-5 mt-2 mb-4 mx-2' />
                    {list.Levels.map((level) => (
                        <Level
                            compact={isCompact}
                            completed={level.Level.completed === 1}
                            list={list}
                            listLevel={level}
                            setPosition={setPosition}
                            dragLocked={isDragLocked}
                            key={level.LevelID}
                        />
                    ))}
                </ol>
            ) : (
                <ol className='lg:text-lg mt-4'>
                    {list.Levels.map((level) => (
                        <Level
                            compact={isCompact}
                            completed={level.Level.completed === 1}
                            list={list}
                            listLevel={level}
                            setPosition={setPosition}
                            dragLocked={isDragLocked}
                            key={level.LevelID}
                        />
                    ))}
                </ol>
            )}
            {list.Levels.length === 0 && (
                <p>
                    <i>This list doesn't have any levels yet</i>
                </p>
            )}
            {list.OwnerID === session.user?.ID && (
                <button onClick={() => openDeleteModal(list)} className='mt-4 text-red-500 underline-t'>
                    Delete list
                </button>
            )}
        </Page>
    );
}
