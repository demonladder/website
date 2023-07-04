import React, { useEffect, useRef } from 'react';
import Select, { SelectOption } from '../../../components/Select';
import FiltersExtended, { TExtendedFilters } from './FiltersExtended';
import { useSessionStorage } from '../../../functions';

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
    show: boolean,
}

export default function FilterMenu({ filter, setExtended, show }: Props) {
    const resetExtended = useRef();
    const [lowTier, setLowTier] = useSessionStorage('search.lowTier', '');
    const [highTier, setHighTier] = useSessionStorage('search.highTier', '');

    function onLowTierChange(event: any) {
        let value: string|number = parseFloat(event.target.value);
        if (isNaN(value)) value = '';
        setLowTier(''+value);
    }
    function onHighTierChange(event: any) {
        let value = event.target.value;
        setHighTier(value);
    }

    const [difficulty, setDifficulty] = useSessionStorage('search.difficulty', 0);
    function onDifficultyChange(val: SelectOption) {
        setDifficulty(val.key);
    }

    const [creator, setCreator] = useSessionStorage('search.creator', '');
    function onCreatorChange(event: any) {
        setCreator(event.target.value);
    }

    const [song, setSong] = useSessionStorage('search.song', '');
    function onSongChange(event: any) {
        setSong(event.target.value);
    }

    const [enjLow, setEnjLow] = useSessionStorage('search.enjLow', '');
    const [enjHigh, setEnjHigh] = useSessionStorage('search.enjHigh', '');

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
        <div className={'filterMenuWrapper' + ((show && ' show') || '')}>
            <div className='filterMenu'>
                <div className='content'>
                    <div className='d-flex justify-content-between mb-3'>
                        <h2 className='m-0' style={{color: 'currentColor'}}>Filters</h2>
                        <button className='danger' onClick={reset}>Reset</button>
                    </div>
                    <div className='d-flex flex-column gap-3'>
                        <div className='row gap-xl-3 row-gap-2'>
                            <div className='col-12 col-sm-6 col-lg-4 col-xl-3'>
                                <p className='form-label m-0'>Tier range:</p>
                                <div className='d-flex align-items-center'>
                                    <input type='number' min='1' max='35' value={lowTier} onChange={onLowTierChange} />
                                    <p className='m-0 mx-2'>to</p>
                                    <input type='number' min='1' max='35' value={highTier} onChange={onHighTierChange} />
                                </div>
                            </div>
                            <div className='col-12 col-sm-6 col-lg-4 col-xl-3'>
                                <p className='form-label m-0'>Enjoyment:</p>
                                <div className='d-flex align-items-center'>
                                    <input type='number' min='0' max='10' value={enjLow} onChange={(e) => setEnjLow(e.target.value)} />
                                    <p className='m-0 mx-2'>to</p>
                                    <input type='number' min='0' max='10' value={enjHigh} onChange={(e) => setEnjHigh(e.target.value)} />
                                </div>
                            </div>
                            <div className='col-md-6 col-lg-4 col-xl-2' style={{height: '52px'}} hidden={!show}>
                                <p className='form-label m-0'>Difficulty:</p>
                                <Select id='filtersDifficulty' options={[
                                    { key: 0, value: '-' },
                                    { key: 1, value: 'Official' },
                                    { key: 2, value: 'Easy' },
                                    { key: 3, value: 'Medium' },
                                    { key: 4, value: 'Hard' },
                                    { key: 5, value: 'Insane' },
                                    { key: 6, value: 'Extreme' }
                                ]} onChange={onDifficultyChange} />
                            </div>
                            <div className='col-md-6 col-lg-5 col-xl-3'>
                                <p className='form-label m-0'>Creator:</p>
                                <input type='text' value={creator} onChange={onCreatorChange} />
                            </div>
                            <div className='col-md-6 col-lg-7 col-xl-4'>
                                <p className='form-label m-0'>Song:</p>
                                <input type="text" value={song} onChange={onSongChange} />
                            </div>
                        </div>
                    </div>
                    <FiltersExtended set={setExtended} resetRef={resetExtended} />
                </div>
            </div>
        </div>
    );
}