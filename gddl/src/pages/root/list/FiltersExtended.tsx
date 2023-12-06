import StorageManager from '../../../utils/StorageManager';
import { NumberInput } from '../../../components/Input';
import CheckBox from '../../../components/input/CheckBox';
import { SearchFilters } from './Ladder';

type Props = {
    filters: SearchFilters,
    setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>,
}

export default function FiltersExtended({ filters, setFilters }: Props) {
    const inSession = StorageManager.hasSession();

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
                        <NumberInput className='num-lg' value={filters.IDLow} min='1' max='500000000' onChange={(e) => setFilters(prev => ({ ...prev, IDLow: e.target.value }))} />
                        <p className='m-0 mx-2'>to</p>
                        <NumberInput className='num-lg' value={filters.IDHigh} min='1' max='500000000' onChange={(e) => setFilters(prev => ({ ...prev, IDHigh: e.target.value }))} />
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-12'>
                <label className='col-span-12 md:col-span-6 xl:col-span-4 flex items-center gap-2 select-none'>
                    <CheckBox checked={filters.exactName} onChange={() => setFilters(prev => ({ ...prev, exactName: !prev.exactName }))} />
                    Exact name search
                </label>
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
                    Pack level
                </label>
            </div>
        </div>
    );
}