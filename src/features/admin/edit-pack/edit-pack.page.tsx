import { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DangerButton, PrimaryButton } from '../../../components/ui/buttons';
import useSessionStorage from '../../../hooks/useSessionStorage';
import renderToastError from '../../../utils/renderToastError';
import { Change } from './types/Change';
import SavePackChangesRequest from '../../../api/packs/requests/SavePackChangesRequest';
import usePackSearch from '../../../hooks/usePackSearch';
import CreatePackRequest from '../../../api/pack/requests/CreatePackRequest';
import DeletePackRequest from '../../../api/pack/requests/DeletePackRequest';
import Meta from './components/Meta';
import { FormInputLabel } from '../../../components/form';
import usePack from '../../singlePack/hooks/usePack';
import List from './components/List';
import { GetPackLevelsResponse as PackLevel } from '../../singlePack/api/getPackLevels';
import Divider from '../../../components/divider/Divider';
import { Link, useNavigate, useParams } from 'react-router';
import { CaretBigLeft } from '@boxicons/react';
import { routes } from '../../../routes/route-definitions';

function checkChangeEquality(change1: Change, change2: Change): boolean {
    return change1.LevelID === change2.LevelID && change1.PackID === change2.PackID && change1.Type === change2.Type;
}

export default function EditPack() {
    const params = useParams();
    const navigate = useNavigate();
    const { searchQuery, SearchBox: PackSearchBox } = usePackSearch({
        ID: 'editPacksSearch',
        onPack: (pack) => {
            if (pack) void navigate(routes.staff.editPack.withId.href(pack.ID));
        },
    });
    const queryClient = useQueryClient();

    const createPack = () => {
        if (searchQuery.trim().length === 0) return toast.error("Name can't be empty");

        const request = CreatePackRequest(searchQuery).then(() => {
            void queryClient.invalidateQueries({ queryKey: ['packs'] });
            void queryClient.invalidateQueries({ queryKey: ['packSearch'] });
        });

        void toast.promise(request, {
            pending: 'Creating...',
            success: 'Created',
            error: renderToastError,
        });
    };

    if (params.packId === undefined) {
        return (
            <div>
                <h3 className='mb-3 text-2xl'>Edit Pack</h3>
                <div className='mb-4'>
                    <FormInputLabel htmlFor='editPacksSearch'>Search</FormInputLabel>
                    <div className='flex'>
                        <div className='grow'>{PackSearchBox}</div>
                        <PrimaryButton onClick={createPack}>Create</PrimaryButton>
                    </div>
                </div>
            </div>
        );
    }

    const packId = parseInt(params.packId);
    if (isNaN(packId)) return <p>Invalid pack ID</p>;

    return <PackEditor packId={packId} />;
}

function PackEditor({ packId }: { packId: number }) {
    const [changeList, setChangeList] = useSessionStorage<Change[]>('editPackChangeList', []);
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const { data } = usePack(packId);

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
        if (data === undefined) return;

        const newChange: Change = {
            PackID: data.ID,
            PackName: data.Name,
            LevelID: level.LevelID,
            LevelName: level.Level.Meta.Name,
            Type: 'remove',
            EX: level.EX === 1,
        };

        // No duplicates
        if (changeList.find((c) => checkChangeEquality(c, newChange)))
            return toast.error('Level already in changelist');

        setChangeList((prev) => [...prev, newChange]);
    }

    function addLevel(levelID: number, levelName: string, EX = false) {
        if (data === undefined) return;

        const newChange: Change = {
            PackID: data.ID,
            PackName: data.Name,
            LevelID: levelID,
            LevelName: levelName,
            Type: 'add',
            EX,
        };

        // No duplicates
        if (
            changeList.find((c) => {
                return checkChangeEquality(c, newChange);
            })
        )
            return;

        setChangeList((prev) => [...prev, newChange]);
    }

    function removeChange(change: Change) {
        setChangeList((prev) => prev.filter((c) => !checkChangeEquality(c, change)));
    }

    function saveChanges() {
        if (data === undefined) return;
        if (isLoading) return;

        const request = SavePackChangesRequest(changeList)
            .then(() => {
                setChangeList([]);
                void queryClient.invalidateQueries({ queryKey: ['packs'] });
                void queryClient.invalidateQueries({ queryKey: ['packSearch'] });
            })
            .finally(() => {
                setIsLoading(false);
            });

        void toast.promise(request, {
            pending: 'Saving...',
            success: 'Saved',
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

    return (
        <div>
            <Link to={routes.staff.editPack.href()} className='text-theme-400 flex items-center mb-2'>
                <CaretBigLeft /> Search
            </Link>
            <h3 className='mb-3 text-2xl'>Edit Pack</h3>
            {data && (
                <div>
                    <Meta pack={data} />
                    <List packID={packId} addLevel={addLevel} removeLevel={removeLevel} />
                </div>
            )}
            {changeList.length > 0 && (
                <div>
                    <Divider />
                    <h3 className='text-xl'>Changelog</h3>
                    {getIndividualPacks().map((pack) => (
                        <div className='mb-2' key={`packChange_${pack[0]?.PackID ?? 0}`}>
                            <h4 className='text-lg'>
                                {pack[0]?.PackName ?? (pack[0]?.PackID && `Pack ID: ${pack[0].PackID}`) ?? 0}
                            </h4>
                            <ul className='grid grid-cols-3'>
                                {pack.map((c, i) => (
                                    <ChangeItem change={c} remove={removeChange} key={`change_${c.PackID}_${i}`} />
                                ))}
                            </ul>
                        </div>
                    ))}
                    <PrimaryButton onClick={saveChanges} className='me-2'>
                        Save
                    </PrimaryButton>
                    <DangerButton onClick={() => setChangeList([])}>Clear</DangerButton>
                </div>
            )}
            <div>
                <Divider />
                <DangerButton onClick={() => deleteMutation.mutate(packId)} loading={deleteMutation.isPending}>
                    Delete pack
                </DangerButton>
            </div>
        </div>
    );
}

function ChangeItem({ change, remove }: { change: Change; remove: (change: Change) => void }) {
    return (
        <li className='flex gap-1'>
            <DangerButton onClick={() => remove(change)}>X</DangerButton>
            <p>
                {change.LevelName}, {change.Type} {change.EX && 'EX'}
            </p>
        </li>
    );
}
