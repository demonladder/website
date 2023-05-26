import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ChangeReferences, GetReferences } from '../../../api/references';
import LoadingSpinner from '../../../components/LoadingSpinner';
import LevelSearchBox from '../../../components/LevelSearchBox';

export default function EditReferences() {
    const [tier, setTier] = useState(1);
    const [changeList, setChangeList] = useState([]);

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
                    {  // eslint-disable-next-line
                        data.filter(l => l.Tier == tier).map(l => <Level data={l} remove={() => {
                            if (changeList.filter(e => e.ID === l.ID && e.Type === 'remove').length === 1) return;  // Make sure the same change doesn't appear twice

                            setChangeList(prev => [...prev, {...l, Type: 'remove'}])
                        }} key={l.ID} />)
                    }
                </div>
                <div className='change-list'>
                    <h3>{changeList[0] && 'Change list'}</h3>
                    <div className='list'>
                        {
                            changeList.map(c => <Level data={c} remove={() => setChangeList(changeList.filter(d => d !== c))} key={c.ID} />)
                        }
                    </div>
                </div>
            </>
        );
    }
    
    function Level({ data, remove }) {
        let action = data.Type + ' ';
        let preposition = (data.Type === 'remove' ? 'from' : 'to') + ' ';
        let targetTier = 'tier ' + data.Tier;

        return (
            <div className='reference'>
                <div>
                    <button className='danger' onClick={remove}>X</button>
                    <div className='name'>
                        <h4>{data.Name}</h4>
                        <p>{data.Type && (action + preposition + targetTier)}</p>
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

    const [search, setSearch] = useState('');
    function addChange() {
        if (!search) return;
        if (changeList.filter(c => c.ID === search.ID && c.Type === 'add').length === 1) return;

        const newChange = {...search, Type: 'add'};
        newChange.Tier = tier;
        setChangeList(prev => [...prev, newChange])
    }

    return (
        <div id='edit-references'>
            <h1 className='mb-5'>Edit References</h1>
            <div className='control'>
                <div>
                    <label className='me-2'>Tier:</label>
                    <input type='number' min='0' max='35' value={tier} onChange={e => setTier(e.target.value)} />
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