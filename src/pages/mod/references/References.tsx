import { useState } from 'react';
import { Reference } from '../../../api/references/getReferences';
import ChangeReferences, { Change, ChangeType } from '../../../api/references/ChangeReferences';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { DangerButton } from '../../../components/ui/buttons/DangerButton';
import { PrimaryButton } from '../../../components/ui/buttons/PrimaryButton';
import { toast } from 'react-toastify';
import useLevelSearch from '../../../hooks/useLevelSearch';
import { useReferences } from '../../../api/references/hooks/useReferences';
import { useMutation } from '@tanstack/react-query';
import FloatingLoadingSpinner from '../../../components/FloatingLoadingSpinner';
import renderToastError from '../../../utils/renderToastError';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import PageButtons from '../../../components/PageButtons';
import Heading3 from '../../../components/headings/Heading3';

interface LevelProps {
    data: Reference;
    remove: () => void;
}

interface ChangeLevelProps {
    data: Change;
    remove: () => void;
}

function ChangeLevel({ data, remove }: ChangeLevelProps) {
    const prefix = (data.Type === ChangeType.Remove ? 'from' : 'to');

    return (
        <div className='flex justify-between'>
            <div className='flex gap-2 items-center'>
                <DangerButton onClick={remove}>X</DangerButton>
                <div className='name'>
                    <h4 className='break-word'>{data.Name}</h4>
                    <p>{`${data.Type} ${prefix} tier ${data.Tier}`}</p>
                </div>
            </div>
            <p>{data.ID}</p>
        </div>
    );
}

function Level({ data, remove }: LevelProps) {
    return (
        <div className='flex gap-2'>
            <div className='grow flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <DangerButton onClick={remove}>X</DangerButton>
                    <div>
                        <h4 className='break-all'>{data.Level.Meta.Name}</h4>
                        <p>{data.LevelID}</p>
                    </div>
                </div>
            </div>
            <div className={`w-16 flex justify-center tier-${data.Level.Rating?.toFixed() ?? 0}`}>
                <p className='self-center'>{data.Level.Rating?.toFixed(2) ?? '-'}</p>
            </div>
        </div>
    );
}

export default function EditReferences() {
    const [tier, setTier] = useQueryParam('tier', withDefault(NumberParam, 1));
    const [maxTier, setMaxTier] = useState(35);
    const [changeList, setChangeList] = useState<Change[]>([]);
    const [removeList, setRemoveList] = useState<number[]>([]);

    const { status, data, refetch } = useReferences();

    const mutation = useMutation(ChangeReferences, {
        onSuccess: () => {
            setChangeList([]);
            void refetch();
            toast.success('Saved');
        },
        onError: (err: Error) => toast.error(renderToastError.render({ data: err })),
    });

    function onSave() {
        mutation.mutate(changeList);
    }

    const { activeLevel, SearchBox } = useLevelSearch({ ID: 'editReferenceLevelInput' });
    function addChange() {
        if (!activeLevel) return;
        if (activeLevel.Rating === null) return;

        if (changeList.filter(c => c.ID === activeLevel.ID && c.Type === ChangeType.Add).length === 1) return;

        const newChange: Change = { Tier: activeLevel.Rating, ID: activeLevel.ID, Name: activeLevel.Meta.Name, Type: ChangeType.Add };
        newChange.Tier = tier;
        setChangeList(prev => [...prev, newChange]);
    }

    function onRemoveReference(reference: Reference) {
        if (!removeList.some((ID) => ID === reference.LevelID)) setRemoveList((prev) => [...prev, reference.LevelID]);

        if (changeList.filter((e) => e.ID === reference.LevelID && e.Type === ChangeType.Remove).length === 1) return;  // Make sure the same change doesn't appear twice
        setChangeList((prev) => [...prev, { Tier: reference.Tier, ID: reference.LevelID, Type: 'remove', Name: reference.Level.Meta.Name } as Change]);
    }

    if (status === 'loading') return <LoadingSpinner isLoading={true} />;
    if (status === 'error') return <Heading3>Something went wrong</Heading3>;

    return (
        <div id='edit-references'>
            <FloatingLoadingSpinner isLoading={mutation.isLoading} />
            <div className='flex justify-between mb-3'>
                <Heading3 className='mb-3'>Edit References</Heading3>
                <PrimaryButton className={(changeList.length > 0 ? 'block' : 'hidden')} onClick={onSave} disabled={mutation.isLoading}>Save changes</PrimaryButton>
            </div>
            <div className=''>
                <label htmlFor='editReferenceLevelInput'>Level:</label>
                <div className='flex'>
                    {SearchBox}
                    <PrimaryButton onClick={addChange}>Add</PrimaryButton>
                </div>
            </div>
            <div className='divider my-3'></div>
            <div className='flex flex-col gap-2 mb-8'>{
                data.filter((l) => l.Tier === tier).map((l) => <Level data={l} remove={() => onRemoveReference(l)} key={l.LevelID} />)
            }</div>
            <PageButtons onPageChange={(page) => setTier(page + 1)} meta={{ page: tier - 1, total: maxTier, limit: 1 }} />
            <div className='flex justify-around'>
                <button className='text-gray-400 underline-t' onClick={() => setMaxTier((prev) => prev + 1)}>Add tier</button>
            </div>
            {changeList.length > 0 &&
                <div className='change-list'>
                    <h3 className='text-xl'>Change list</h3>
                    <div className='list'>{
                        changeList.map(c => <ChangeLevel data={c} remove={() => setChangeList(changeList.filter(d => d !== c))} key={c.ID} />)
                    }</div>
                </div>
            }
            <RemoveList references={removeList} undo={(ID) => setRemoveList((prev) => prev.filter((r) => r !== ID))} />
        </div>
    );
}

function RemoveList({ references, undo }: { references: number[], undo: (ID: number) => void }) {
    const { data } = useReferences();

    if (!data) return <LoadingSpinner isLoading={true} />;

    return (
        <div>
            <h3 className='text-xl'>To remove</h3>
            <ul>{
                references.map((ID) => data.find((r) => r.LevelID === ID)).filter((r) => r !== undefined).map((r) => (
                    <ChangeLevel data={{ ID: r.LevelID, Name: r.Level.Meta.Name, Tier: r.Tier, Type: ChangeType.Remove }} remove={() => undo(r.LevelID)} key={r!.LevelID} />
                ))
            }</ul>
        </div>
    );
}
