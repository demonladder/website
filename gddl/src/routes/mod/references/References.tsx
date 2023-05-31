import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Change, ChangeReferences, ChangeType, GetReferences } from '../../../api/references';
import LoadingSpinner from '../../../components/LoadingSpinner';
import LevelSearchBox from '../../../components/LevelSearchBox';
import { Level } from '../../../api/levels';

type Reference = {
    Tier: number,
    ID: number,
    Name: string,
}

type LevelProps = {
    data: Reference,
    remove: () => void,
}

type ChangeLevelProps = {
    data: Change,
    remove: () => void,
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
                <div className='divider-lg'></div>
                <div className='list'>
                    {
                        data.filter((l) => l.Tier === tier).map((l: Reference) => <Level data={l} remove={() => {
                            if (changeList.filter((e: Change) => e.ID === l.ID && e.Type === 'remove').length === 1) return;  // Make sure the same change doesn't appear twice

                            setChangeList((prev: Change[]) => [...prev, {Tier: l.Tier, ID: l.ID, Type: 'remove'} as Change]);
                        }} key={l.ID} />)
                    }
                </div>
                <div className='change-list'>
                    <h3>{changeList[0] && 'Change list'}</h3>
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
        return (
            <div className='reference'>
                <div>
                    <button className='danger' onClick={remove}>X</button>
                    <div className='name'>
                        <h4>{data.Name}</h4>
                    </div>
                </div>
                <p>{data.ID}</p>
            </div>
        );
    }

    function ChangeLevel({ data, remove }: ChangeLevelProps) {
        let action = data.Type + ' ';
        let preposition = (data.Type === 'remove' ? 'from' : 'to') + ' ';
        let targetTier = 'tier ' + data.Tier;

        return (
            <div className='reference'>
                <div>
                    <button className='danger' onClick={remove}>X</button>
                    <div className='name'>
                        <h4>{data.Type}</h4>
                        <p>{action + preposition + targetTier}</p>
                    </div>
                </div>
                <p>{data.ID}</p>
            </div>
        );
    }

    const queryClient = useQueryClient();

    const mutateReferences = useMutation({
        mutationFn: ChangeReferences,
        onSuccess: () => {
            setChangeList([]);
            queryClient.invalidateQueries(['editReferences']);
        }
    });

    function save() {
        mutateReferences.mutate(changeList);
    }

    const [search, setSearch] = useState<Level>();
    function addChange() {
        if (!search) return;
        if (changeList.filter(c => c.ID === search.ID && c.Type === 'add').length === 1) return;

        const newChange: Change = {Tier: search.Rating, ID: search.ID, Type: ChangeType.Add};
        newChange.Tier = tier;
        setChangeList(prev => [...prev, newChange])
    }

    return (
        <div id='edit-references'>
            <h1 className='mb-5'>Edit References</h1>
            <div className='control'>
                <div>
                    <label className='me-2'>Tier:</label>
                    <input type='number' min='0' max='35' value={tier} onChange={e => setTier(parseInt(e.target.value))} />
                </div>
                <button className={'save' + (changeList.length > 0 ? ' show' : '')} disabled={mutateReferences.isLoading} onClick={save}>Save changes</button>
            </div>
            <div className='position-relative'>
                <LevelSearchBox setResult={s => setSearch(s)} />
            </div>
            <button className='primary' onClick={addChange}>Add</button>
            <Content />
        </div>
    );
}