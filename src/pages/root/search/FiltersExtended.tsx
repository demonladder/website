import StorageManager from '../../../utils/StorageManager';
import { NumberInput, TextInput } from '../../../components/Input';
import CheckBox from '../../../components/input/CheckBox';
import { SearchFilters } from './Search';
import Select from '../../../components/Select';
import NewLabel from '../../../components/NewLabel';
import { useQuery } from '@tanstack/react-query';
import GetTags from '../../../api/tags/GetTags';
import { useCallback } from 'react';

type Props = {
    filters: SearchFilters,
    setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>,
}

const twoPlayerOptions = {
    any: 'Any',
    no: 'No two player',
    only: 'Only two player',
};

const updateOptions = {
    any: 'Any',
    '4-1729': '1.0',
    '1729-9228': '1.1',
    '9228-63099': '1.2',
    '63099-120716': '1.3',
    '120716-184402': '1.4',
    '184402-418434': '1.5',
    '418434-826013': '1.6',
    '826013-1619692': '1.7',
    '1619692-2808696': '1.8',
    '2808696-11007009': '1.9',
    '11007009-28355990': '2.0',
    '28355990-97452273': '2.1',
    '97452273-1000000000': '2.2',
};

export default function FiltersExtended({ filters, setFilters }: Props) {
    const inSession = StorageManager.hasSession();

    const { data: tags } = useQuery({
        queryKey: ['tags'],
        queryFn: GetTags,
    });

    const onUpdateChange = useCallback((key: string) => {
        if (key !== 'any') {
            const lowID = key.split('-')[0];
            const highID = key.split('-')[1];
            setFilters(prev => ({ ...prev, update: key, IDLow: lowID, IDHigh: highID }));
        } else {
            setFilters(prev => ({ ...prev, update: key, IDLow: '', IDHigh: '' }));
        }
    }, [setFilters]);

    return (
        <div className='flex flex-col gap-3'>
            <div className='grid grid-cols-12 gap-3'>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p className='form-label m-0'>Submission count:</p>
                    <div className='flex items-center'>
                        <NumberInput value={filters.subLowCount} min='1' max='1000' onChange={(e) => setFilters(prev => ({ ...prev, subLowCount: e.target.value }))} />
                        <p className='m-0 mx-2'>to</p>
                        <NumberInput value={filters.subHighCount} min='1' max='1000' onChange={(e) => setFilters(prev => ({ ...prev, subHighCount: e.target.value }))} />
                    </div>
                </div>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p className='form-label m-0'>Enjoyment count:</p>
                    <div className='flex items-center'>
                        <NumberInput value={filters.enjLowCount} min='1' max='1000' onChange={(e) => setFilters(prev => ({ ...prev, enjLowCount: e.target.value }))} />
                        <p className='m-0 mx-2'>to</p>
                        <NumberInput value={filters.enjHighCount} min='1' max='1000' onChange={(e) => setFilters(prev => ({ ...prev, enjHighCount: e.target.value }))} />
                    </div>
                </div>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p className='form-label m-0'>Rating deviation:</p>
                    <div className='flex items-center'>
                        <NumberInput className='num-lg' value={filters.devLow} min='1' max='10' onChange={(e) => setFilters(prev => ({ ...prev, devLow: e.target.value }))} />
                        <p className='m-0 mx-2'>to</p>
                        <NumberInput className='num-lg' value={filters.devHigh} min='1' max='10' onChange={(e) => setFilters(prev => ({ ...prev, devHigh: e.target.value }))} />
                    </div>
                </div>
                <div className='col-span-12 md:col-span-6 xl:col-span-6'>
                    <p className='form-label m-0'>Level ID:</p>
                    <div className='flex items-center'>
                        <NumberInput className='num-lg' value={filters.IDLow} min='1' max='500000000' onChange={(e) => setFilters(prev => ({ ...prev, IDLow: e.target.value, update: 'any' }))} />
                        <p className='m-0 mx-2'>to</p>
                        <TextInput className='num-lg' value={filters.IDHigh} min='1' max='500000000' onChange={(e) => setFilters(prev => ({ ...prev, IDHigh: e.target.value, update: 'any' }))} />
                    </div>
                </div>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p className='form-label m-0'>Two player:</p>
                    <Select height='20' activeKey={filters.twoPlayer} options={twoPlayerOptions} onChange={(key) => setFilters(prev => ({ ...prev, twoPlayer: key }))} id='twoPlayerSelectOptions' />
                </div>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p>Update <NewLabel ID='updateFilter' /></p>
                    <Select height='20' activeKey={filters.update} options={updateOptions} onChange={onUpdateChange} id='updateSelectOptions' />
                </div>
                <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                    <p>Top skillset <NewLabel ID='skillsetFilter' /></p>
                    <Select height='20' activeKey={filters.skillset.toString()} options={[...(tags ?? []).map((t) => ({ key: t.ID.toString(), value: t.Name })), { key: '0', value: 'Any' }]} onChange={(key) => setFilters(prev => ({ ...prev, skillset: parseInt(key) }))} id='skillsetSelectOptions' />
                </div>
            </div>
            <div className='grid grid-cols-12'>
                <label className={'col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none' + (inSession ? '' : ' text-gray-500 line-through')}>
                    <CheckBox checked={filters.removeCompleted} onChange={() => setFilters(prev => ({ ...prev, removeCompleted: !prev.removeCompleted }))} disabled={!inSession} />
                    Exclude completed
                </label>
                <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none'>
                    <CheckBox checked={filters.removeUnrated} onChange={() => setFilters(prev => ({ ...prev, removeUnrated: !prev.removeUnrated }))} />
                    Exclude unrated tier
                </label>
                <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none'>
                    <CheckBox checked={filters.removeUnratedEnj} onChange={() => setFilters(prev => ({ ...prev, removeUnratedEnj: !prev.removeUnratedEnj }))} />
                    Exclude unrated enjoyment
                </label>
                <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none'>
                    <CheckBox checked={filters.removeRated} onChange={() => setFilters(prev => ({ ...prev, removeRated: !prev.removeRated }))} />
                    Exclude rated tier
                </label>
                <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none'>
                    <CheckBox checked={filters.removeRatedEnj} onChange={() => setFilters(prev => ({ ...prev, removeRatedEnj: !prev.removeRatedEnj }))} />
                    Exclude rated enjoyment
                </label>
                <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none'>
                    <CheckBox checked={filters.inPack} onChange={() => setFilters(prev => ({ ...prev, inPack: !prev.inPack }))} />
                    Exclude non-pack levels
                </label>
            </div>
        </div>
    );
}