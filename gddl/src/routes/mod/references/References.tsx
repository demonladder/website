import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Change, ChangeReferences, ChangeType, GetReferences } from '../../../api/references';
import LoadingSpinner from '../../../components/LoadingSpinner';
import LevelSearchBox from '../../../components/LevelSearchBox';
import { Level as TLevel } from '../../../api/levels';
import { ToFixed } from '../../../functions';
import { DangerButton, PrimaryButton } from '../../../components/Button';
import { NumberInput } from '../../../components/Input';
import { toast } from 'react-toastify';

type Reference = {
    Tier: number,
    ID: number,
    Name: string,
    Rating: number,
}

type LevelProps = {
    data: Reference,
    remove: () => void,
}

type ChangeLevelProps = {
    data: Change,
    remove: () => void,
}

function ChangeLevel({ data, remove }: ChangeLevelProps) {
    let action = data.Type + ' ';
    let preposition = (data.Type === 'remove' ? 'from' : 'to') + ' ';
    let targetTier = 'tier ' + data.Tier;

    return (
        <div className='flex justify-between'>
            <div className='flex gap-2 items-center'>
                <DangerButton onClick={remove}>X</DangerButton>
                <div className='name'>
                    <h4>{data.Name}</h4>
                    <p>{action + preposition + targetTier}</p>
                </div>
            </div>
            <p>{data.ID}</p>
        </div>
    );
}

export default function EditReferences() {
    const [tier, setTier] = useState(1);
    const [changeList, setChangeList] = useState<Change[]>([]);

    const { status, data } = useQuery({
        queryKey: ['editReferences'],
        queryFn: GetReferences
    });

    function Content() {
        if (status ==='loading') return <LoadingSpinner isLoading={true} />;
        if (status ==='error') return <h3>Something went wrong</h3>

        return (
            <>
                <div className='divider my-3'></div>
                <div className='flex flex-col gap-1 mb-8'>
                    {
                        data.filter((l) => l.Tier === tier).map(l => <Level data={l} remove={() => {
                            if (changeList.filter((e) => e.ID === l.ID && e.Type === 'remove').length === 1) return;  // Make sure the same change doesn't appear twice

                            setChangeList((prev) => [...prev, {Tier: l.Tier, ID: l.ID, Type: 'remove', Name: l.Name } as Change]);
                        }} key={l.ID} />)
                    }
                </div>
                <div className='change-list'>
                    <h3 className='text-xl'>{changeList[0] && 'Change list'}</h3>
                    <div className='list'>
                        {
                            changeList.map(c => <ChangeLevel data={c} remove={() => setChangeList(changeList.filter(d => d !== c))} key={c.ID} />)
                        }
                    </div>
                </div>
            </>
        );
    }
    
    function Level({ data, remove }: LevelProps) {
        const roundedTier = Math.round(data.Rating);

        return (
            <div className='flex gap-2'>
                <div className='grow flex justify-between items-center'>
                    <div className='flex gap-2 items-center'>
                        <DangerButton onClick={remove}>X</DangerButton>
                        <div className='name'>
                            <h4>{data.Name}</h4>
                        </div>
                    </div>
                    <p>{data.ID}</p>
                </div>
                <div className={'w-16 flex justify-center tier-' + roundedTier}>
                    <p className='self-center'>{ToFixed(''+data.Rating, 2, '-')}</p>
                </div>
            </div>
        );
    }

    const queryClient = useQueryClient();

    const loadingRef = useRef(false);
    function save() {
        if (!loadingRef.current) {
            loadingRef.current = true;
            toast.promise(ChangeReferences(changeList).then(() => {
                setChangeList([]);
                queryClient.invalidateQueries(['editReferences']);
            }).finally(() => loadingRef.current = false), {
                pending: 'Saving...',
                success: 'Saved',
                error: 'An error occurred',
            });
        }
    }

    const [search, setSearch] = useState<TLevel>();
    function addChange() {
        if (!search) return;
        if (search.Rating === null) return;

        if (changeList.filter(c => c.ID === search.LevelID && c.Type === 'add').length === 1) return;

        const newChange: Change = { Tier: search.Rating, ID: search.LevelID, Name: search.Name, Type: ChangeType.Add };
        newChange.Tier = tier;
        setChangeList(prev => [...prev, newChange])
    }

    return (
        <div id='edit-references'>
            <h3 className='mb-3 text-2xl'>Edit References</h3>
            <div className='flex justify-between mb-3'>
                <div>
                    <label className='me-2' htmlFor='editReferenceTierInput'>Edit tier:</label>
                    <NumberInput id='editReferenceTierInput' min='0' max='35' value={tier} onChange={e => setTier(parseInt(e.target.value))} />
                </div>
                <PrimaryButton className={(changeList.length > 0 ? 'block' : 'hidden')} onClick={save}>Save changes</PrimaryButton>
            </div>
            <div className='position-relative'>
                <label htmlFor='editReferenceLevelInput'>Level:</label>
                <div className='flex'>
                    <LevelSearchBox id='editReferenceLevelInput' setResult={s => setSearch(s)} />
                    <PrimaryButton onClick={addChange}>Add</PrimaryButton>
                </div>
            </div>
            <Content />
        </div>
    );
}