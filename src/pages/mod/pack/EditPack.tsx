import { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import useSessionStorage from '../../../hooks/useSessionStorage';
import renderToastError from '../../../utils/renderToastError';
import { Change } from './types/Change';
import SavePackChangesRequest from '../../../api/packs/requests/SavePackChangesRequest';
import usePackSearch from '../../../hooks/usePackSearch';
import CreatePackRequest from '../../../api/pack/requests/CreatePackRequest';
import DeletePackRequest from '../../../api/pack/requests/DeletePackRequest';
import Meta from './Meta';
import FormInputLabel from '../../../components/form/FormInputLabel';
import usePack from '../../../features/singlePack/hooks/usePack';
import List from './List';
import { GetPackLevelsResponse as PackLevel } from '../../../features/singlePack/api/getPackLevels';
import Divider from '../../../components/divider/Divider';

function checkChangeEquality(change1: Change, change2: Change): boolean {
    return change1.LevelID === change2.LevelID && change1.PackID === change2.PackID && change1.Type === change2.Type;
}

export default function EditPack() {
    const {
        activePack: packResult,
        searchQuery,
        SearchBox: PackSearchBox,
    } = usePackSearch({ ID: 'editPacksSearch' });
    const [changeList, setChangeList] = useSessionStorage<Change[]>('editPackChangeList', []);
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const { data } = usePack(packResult?.ID ?? 0, {
        enabled: packResult !== undefined,
    });

    function getIndividualPacks() {
        const uniquePacks = changeList.reduce((acc: number[], cur) => {
            if (acc.includes(cur.PackID)) return acc;

            return [...acc, cur.PackID];
        }, []);

        return uniquePacks.map((packID) => {
            return changeList.filter((c) => c.PackID === packID);
        });
    }

    function removeLevel(level: PackLevel) {
        if (packResult === undefined) return;

        const newChange: Change = {
            PackID: packResult.ID,
            PackName: packResult.Name,
            LevelID: level.LevelID,
            LevelName: level.Level.Meta.Name,
            Type: 'remove',
            EX: level.EX === 1,
        };

        // No duplicates
        if (changeList.find((c) => checkChangeEquality(c, newChange))) return toast.error('Level already in changelist');

        setChangeList((prev) => [
            ...prev,
            newChange,
        ]);
    }

    function addLevel(levelID: number, levelName: string, EX = false) {
        if (packResult === undefined) return;

        const newChange: Change = {
            PackID: packResult.ID,
            PackName: packResult.Name,
            LevelID: levelID,
            LevelName: levelName,
            Type: 'add',
            EX,
        };

        // No duplicates
        if (changeList.find((c) => {
            return checkChangeEquality(c, newChange);
        })) return;

        setChangeList((prev) => [
            ...prev,
            newChange,
        ]);
    }

    function removeChange(change: Change) {
        setChangeList((prev) => prev.filter((c) => !checkChangeEquality(c, change)));
    }

    function saveChanges() {
        if (packResult === undefined) return;
        if (isLoading) return;

        const request = SavePackChangesRequest(changeList).then(() => {
            setChangeList([]);
            void queryClient.invalidateQueries({ queryKey: ['packs'] });
            void queryClient.invalidateQueries({ queryKey: ['packSearch'] });
        }).finally(() => {
            setIsLoading(false);
        });

        void toast.promise(request, {
            pending: 'Saving...',
            success: 'Saved',
            error: renderToastError,
        });
    }

    function createPack() {
        if (isLoading) return;

        if (searchQuery.trim().length === 0) {
            return toast.error('Name can\'t be empty');
        }
        const request = CreatePackRequest(searchQuery).then(() => {
            setChangeList([]);
            void queryClient.invalidateQueries({ queryKey: ['packs'] });
            void queryClient.invalidateQueries({ queryKey: ['packSearch'] });
        }).finally(() => {
            setIsLoading(false);
        });

        void toast.promise(request, {
            pending: 'Creating...',
            success: 'Created',
            error: renderToastError,
        });
    }

    const deleteMutation = useMutation({
        mutationFn: DeletePackRequest,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['packs'] });
            void queryClient.invalidateQueries({ queryKey: ['packSearch'] });
            toast.success('Deleted pack');
        },
        onError: (error: Error) => void toast.error(renderToastError.render({ data: error })),
    });

    const hasContent = packResult !== undefined && data !== undefined;
    return (
        <div>
            <h3 className='mb-3 text-2xl'>Edit Pack</h3>
            <div className='mb-4'>
                <FormInputLabel htmlFor='editPacksSearch'>Search</FormInputLabel>
                <div className='flex'>
                    <div className='grow'>
                        {PackSearchBox}
                    </div>
                    <PrimaryButton onClick={createPack} hidden={packResult !== undefined}>Create</PrimaryButton>
                </div>
            </div>
            {hasContent &&
                <div>
                    <Meta packID={packResult.ID} />
                    <List packID={packResult.ID} addLevel={addLevel} removeLevel={removeLevel} />
                </div>
            }
            {changeList.length > 0 &&
                <div>
                    <Divider />
                    <h3 className='text-xl'>Changelog</h3>
                    {getIndividualPacks().map((pack) => (
                        <div className='mb-2' key={`packChange_${pack[0]?.PackID || 0}`}>
                            <h4 className='text-lg'>{pack[0]?.PackName || (pack[0]?.PackID && `Pack ID: ${pack[0].PackID}`) || 0}</h4>
                            <ul className='grid grid-cols-3'>
                                {pack.map((c, i) => (<ChangeItem change={c} remove={removeChange} key={`change_${c.PackID}_${i}`} />))}
                            </ul>
                        </div>
                    ))}
                    <PrimaryButton onClick={saveChanges} className='me-2'>Save</PrimaryButton>
                    <DangerButton onClick={() => setChangeList([])}>Clear</DangerButton>
                </div>
            }
            {hasContent &&
                <div>
                    <Divider />
                    <DangerButton onClick={() => deleteMutation.mutate(packResult.ID)} loading={deleteMutation.isPending}>Delete pack</DangerButton>
                </div>
            }
        </div>
    );
}

export function Level({ level, onRemove }: { level: PackLevel, onRemove: () => void }) {
    return (
        <li>
            <DangerButton className='me-1' onClick={() => onRemove()}>X</DangerButton>
            <span>{level.Level.Meta.Name} {level.EX === 1 && '[EX]'}</span>
        </li>
    );
}

function ChangeItem({ change, remove }: { change: Change, remove: (change: Change) => void }) {
    return (
        <li className='flex gap-1'>
            <DangerButton onClick={() => remove(change)}>X</DangerButton>
            <p>{change.LevelName}, {change.Type} {change.EX && 'EX'}</p>
        </li>
    );
}
