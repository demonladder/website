import { useState } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GetSinglePack } from '../../../api/pack/requests/GetSinglePack';
import { DangerButton, PrimaryButton } from '../../../components/Button';
import { PackLevel } from '../../../api/packs/types/PackLevel';
import useSessionStorage from '../../../hooks/useSessionStorage';
import useLevelSearch from '../../../hooks/useLevelSearch';
import renderToastError from '../../../utils/renderToastError';
import { Change } from './types/Change';
import { SavePackChangesRequest } from '../../../api/packs/requests/SavePackChangesRequest';
import usePackSearch from '../../../hooks/usePackSearch';
import { CreatePackRequest } from '../../../api/pack/requests/CreatePackRequest';
import DeletePackRequest from '../../../api/pack/requests/DeletePackRequest';
import { TextInput } from '../../../components/Input';
import Meta from './Meta';

function checkChangeEquality(change1: Change, change2: Change): boolean {
    return change1.LevelID === change2.LevelID && change1.PackID === change2.PackID && change1.Type === change2.Type;
}

export default function EditPack() {
    const {
        activePack: packResult,
        searchQuery,
        SearchBox: PackSearchBox,
    } = usePackSearch({ ID: 'editPacksSearch' });
    const addLevelSearch = useLevelSearch({ ID: 'editPacksAddSearch' });
    const [changeList, setChangeList] = useSessionStorage<Change[]>('editPackChangeList', []);
    const [isLoading, setIsLoading] = useState(false);
    const [levelFilter, setLevelFilter] = useState('');

    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['packs', packResult?.ID],
        queryFn: () => GetSinglePack(packResult?.ID || 0),
        enabled: packResult !== undefined,
    });

    function getIndividualPacks() {
        const uniquePacks = changeList.reduce((acc: number[], cur) => {
            if (acc.includes(cur.PackID)) return acc;

            return [ ...acc, cur.PackID ];
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
            LevelName: level.Name,
            Type: 'remove',
            EX: level.EX === 1,
        };

        // No duplicates
        if (changeList.find((c) => checkChangeEquality(c, newChange))) return;

        setChangeList((prev) => [
            ...prev,
            newChange,
        ]);
    }

    function addLevel(EX = false) {
        if (packResult === undefined) return;
        if (addLevelSearch.activeLevel === undefined) return;

        // Level must not be in pack
        const addResult = addLevelSearch.activeLevel;
        if (data?.Levels.find((l) => l.LevelID === addResult.ID)) return;

        const newChange: Change = {
            PackID: packResult.ID,
            PackName: packResult.Name,
            LevelID: addResult.ID,
            LevelName: addResult.Meta.Name,
            Type: 'add',
            EX,
        }

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

        const request = SavePackChangesRequest(packResult.ID, changeList);
        request.then(() => {
            setChangeList([]);
            queryClient.invalidateQueries(['packs']);
            queryClient.invalidateQueries(['packSearch']);
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
        const request = CreatePackRequest(searchQuery);
        request.then(() => {
            setChangeList([]);
            queryClient.invalidateQueries(['packs']);
            queryClient.invalidateQueries(['packSearch']);
        }).finally(() => {
            setIsLoading(false);
        });
    
        void toast.promise(request, {
            pending: 'Saving...',
            success: 'Saved',
            error: renderToastError,
        });
    }

    function deletePack() {
        if (!packResult) return;

        const request = DeletePackRequest(packResult.ID).then(() => {
            queryClient.invalidateQueries(['packs']);
            queryClient.invalidateQueries(['packSearch']);
        });

        void toast.promise(request, {
            pending: 'Deleting...',
            success: 'Deleted ' + packResult.Name,
            error: renderToastError,
        });
    }

    const hasContent = packResult !== undefined && data !== undefined;
    return (
        <div>
            <h3 className='mb-3 text-2xl'>Edit Pack</h3>
            <div className='mb-4'>
                <label>Pack:</label>
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
                    <div className='mb-6'>
                        <div className='divider my-4'></div>
                        <h3 className='text-xl'>Levels:</h3>
                        <div className='mb-4'>
                            {addLevelSearch.SearchBox}
                            <PrimaryButton onClick={() => addLevel()} className='me-2'>Add</PrimaryButton>
                            <PrimaryButton onClick={() => addLevel(true)}>Add EX</PrimaryButton>
                        </div>
                        <div>
                            <TextInput value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} placeholder='Filter levels' />
                            <ul className='grid grid-cols-3 gap-2'>
                                {data.Levels.filter((l) => levelFilter === '' || l.Name.toLowerCase().startsWith(levelFilter)).map((l) => (
                                    <Level level={l} onRemove={removeLevel} key={'pack_' + data.ID.toString() + '_' + l.LevelID.toString()}/>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            }
            {changeList.length > 0 &&
                <div>
                    <div className='divider my-4'></div>
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
                    <div className='divider my-4'></div>
                    <DangerButton onClick={deletePack}>Delete pack</DangerButton>
                </div>
            }
        </div>
    );
}

function Level({ level, onRemove }: { level: PackLevel, onRemove: (levelID: PackLevel) => void }) {
    return (
        <li>
            <DangerButton className='me-1' onClick={() => onRemove(level)}>X</DangerButton>
            <span>{level.Name} {level.EX === 1 && 'EX'}</span>
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