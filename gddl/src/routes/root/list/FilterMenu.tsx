import React, { useEffect, useRef, useState } from 'react';
import Select, { SelectOption } from '../../../components/Select';
import FiltersExtended, { TExtendedFilters } from './FiltersExtended';

export type Filters = {
    lowTier: string,
    highTier: string,
    enjLow: string,
    enjHigh: string,
    difficulty: number,
    creator: string,
    song: string,
}

type Props = {
    filter: (filters: Filters) => void,
    setExtended: (filters: TExtendedFilters) => void,
}

export default function FilterMenu({ filter, setExtended }: Props) {
    const resetExtended = useRef();
    const [lowTier, setLowTier] = useState('');
    const [highTier, setHighTier] = useState('');

    function onLowTierChange(event: any) {
        let value: string|number = parseFloat(event.target.value);
        if (isNaN(value)) value = '';
        setLowTier(''+value);
    }
    function onHighTierChange(event: any) {
        let value = event.target.value;
        setHighTier(value);
    }

    const [difficulty, setDifficulty] = useState(0);
    function onDifficultyChange(val: SelectOption) {
        setDifficulty(val.key);
    }

    const [creator, setCreator] = useState('');
    function onCreatorChange(event: any) {
        setCreator(event.target.value);
    }

    const [song, setSong] = useState('');
    function onSongChange(event: any) {
        setSong(event.target.value);
    }

    const [enjLow, setEnjLow] = useState('');
    const [enjHigh, setEnjHigh] = useState('');

    useEffect(() => {
        filter({
            lowTier,
            highTier,
            enjLow,
            enjHigh,
            difficulty,
            creator,
            song
        });
    }, [lowTier, highTier, enjLow, enjHigh, difficulty, creator, song, filter]);

    function reset() {
        setLowTier('');
        setHighTier('');
        setEnjLow('');
        setEnjHigh('');
        setDifficulty(0);
        setCreator('');
        setSong('');
        if (resetExtended.current === undefined) return;
        (resetExtended.current as any).reset();
    }

    return (
        <div id='filter-menu'>
            <div className='content'>
                <div className='d-flex justify-content-between mb-3'>
                    <h2 className='m-0'>Filters</h2>
                    <button className='danger' onClick={reset}>Reset</button>
                </div>
                <div className='d-flex flex-column gap-3'>
                    <div className='row gap-xl-3 row-gap-2'>
                        <div className='col-6 col-sm-5 col-lg-4 col-xl-2'>
                            <p className='form-label m-0'>Tier range:</p>
                            <div className='d-flex align-items-center'>
                                <input type='number' min='1' max='35' value={lowTier} onChange={onLowTierChange} />
                                <p className='m-0 mx-2'>to</p>
                                <input type='number' min='1' max='35' value={highTier} onChange={onHighTierChange} />
                            </div>
                        </div>
                        <div className='col-6 col-sm-5 col-lg-4 col-xl-2'>
                            <p className='form-label m-0'>Enjoyment:</p>
                            <div className='d-flex align-items-center'>
                                <input type='number' min='0' max='10' value={enjLow} onChange={(e) => setEnjLow(e.target.value)} />
                                <p className='m-0 mx-2'>to</p>
                                <input type='number' min='0' max='10' value={enjHigh} onChange={(e) => setEnjHigh(e.target.value)} />
                            </div>
                        </div>
                        <div className='col-sm-5 col-md-4 col-lg-3 col-xl-2'>
                            <p className='form-label m-0'>Difficulty:</p>
                            <Select options={[
                                { key: 0, value: '-' },
                                { key: 1, value: 'Official' },
                                { key: 2, value: 'Easy' },
                                { key: 3, value: 'Medium' },
                                { key: 4, value: 'Hard' },
                                { key: 5, value: 'Insane' },
                                { key: 6, value: 'Extreme' }
                            ]} onChange={onDifficultyChange} />
                        </div>
                        <div className='col-lg-5 col-xl-2'>
                            <p className='form-label m-0'>Creator:</p>
                            <input type='text' value={creator} onChange={onCreatorChange} />
                        </div>
                        <div className='col-md-7 col-lg-6 col-xl-3'>
                            <p className='form-label m-0'>Song:</p>
                            <input type="text" value={song} onChange={onSongChange} />
                        </div>
                    </div>
                </div>
                <FiltersExtended set={setExtended} resetRef={resetExtended} />
            </div>
        </div>
    );
}