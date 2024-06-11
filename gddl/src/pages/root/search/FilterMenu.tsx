import Select from '../../../components/Select';
import FiltersExtended from './FiltersExtended';
import { NumberInput, TextInput } from '../../../components/Input';
import { SearchFilters } from './Search';
import { DangerButton } from '../../../components/Button';
import { useState } from 'react';

type Props = {
    filters: SearchFilters,
    setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>,
    reset: () => void,
    show: boolean,
}

const difficultyOptions = {
    '-1': 'Any',
    '0': 'Official',
    '1': 'Easy',
    '2': 'Medium',
    '3': 'Hard',
    '4': 'Insane',
    '5': 'Extreme',
};

const lengthOptions = {
    0: 'Any',
    1: 'Tiny',
    2: 'Short',
    3: 'Medium',
    4: 'Long',
    5: 'XL',
    6: 'Platformer',
};

export default function FilterMenu({ filters, setFilters, reset, show }: Props) {
    const [difficultyKey, setDifficultyKey] = useState('0');

    function onLowTierChange(e: any) {
        let value: string | number = parseFloat(e.target.value);

        if (isNaN(value)) value = '';
        setFilters(prev => ({ ...prev, lowTier: '' + value }));
    }
    function onHighTierChange(e: any) {
        let value: string | number = parseFloat(e.target.value);

        if (isNaN(value)) value = '';
        setFilters(prev => ({ ...prev, highTier: '' + value }));
    }

    function onDifficultyChange(key: string) {
        setDifficultyKey(key);
        setFilters(prev => ({ ...prev, difficulty: parseInt(key) }));
    }

    return (
        <div className='grid overflow-hidden transition-[grid-template-rows]' style={{ gridTemplateRows: show ? '1fr' : '0fr' }}>
            <div className='min-h-0 bg-gray-700 round:rounded-b-3xl'>
                <div className='px-7 py-4 flex flex-col gap-4'>
                    <div className='flex justify-between'>
                        <h2 className='text-2xl' style={{ color: 'currentColor' }}>Filters</h2>
                        <DangerButton onClick={reset}>Reset</DangerButton>
                    </div>
                    <div className='grid grid-cols-12 gap-4 gap-y-2'>
                        <div className='col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2'>
                            <p>Tier range:</p>
                            <div className='flex items-center'>
                                <NumberInput min='1' max='35' value={filters.lowTier} onChange={onLowTierChange} />
                                <p className='m-0 mx-2'>to</p>
                                <NumberInput min='1' max='35' value={filters.highTier} onChange={onHighTierChange} />
                            </div>
                        </div>
                        <div className='col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2'>
                            <p>Enjoyment:</p>
                            <div className='flex items-center'>
                                <NumberInput min='0' max='10' value={filters.enjLow} onChange={(e) => setFilters(prev => ({ ...prev, enjLow: e.target.value }))} />
                                <p className='m-0 mx-2'>to</p>
                                <NumberInput min='0' max='10' value={filters.enjHigh} onChange={(e) => setFilters(prev => ({ ...prev, enjHigh: e.target.value }))} />
                            </div>
                        </div>
                        <div className='col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-2'>
                            <p>Difficulty:</p>
                            <Select id='filtersDifficulty' options={difficultyOptions} activeKey={difficultyKey} onChange={onDifficultyChange} />
                        </div>
                        <div className='col-span-12 sm:col-span-6 lg:col-span-5 xl:col-span-2'>
                            <p>Creator:</p>
                            <TextInput value={filters.creator} onChange={(e) => setFilters(prev => ({ ...prev, creator: e.target.value }))} />
                        </div>
                        <div className='col-span-12 lg:col-span-7 xl:col-span-4'>
                            <p>Song:</p>
                            <TextInput value={filters.song} onChange={(e) => setFilters(prev => ({ ...prev, song: e.target.value }))} />
                        </div>
                        <div className='col-span-12 sm:col-span-6 lg:col-span-3 xl:col-span-2'>
                            <p className='form-label m-0'>Length:</p>
                            <Select activeKey={filters.length} onChange={(key) => setFilters(prev => ({ ...prev, length: key }))} options={lengthOptions} id='lengthSelectOptions' />
                        </div>
                    </div>
                    <div className='divider my-3'></div>
                    <FiltersExtended filters={filters} setFilters={setFilters} />
                </div>
            </div>
        </div>
    );
}