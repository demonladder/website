import React, { useEffect, useState } from 'react';
import Select from '../../../components/Select';

export default function FilterMenu({ filter, sessionID }) {
    const [lowTier, setLowTier] = useState('');
    const [highTier, setHighTier] = useState('');

    function onLowTierChange(event) {
        let value = parseFloat(event.target.value);
        if (isNaN(value)) value = '';
        setLowTier(value);
    }
    function onHighTierChange(event) {
        let value = event.target.value;
        setHighTier(value);
    }

    const [removeUnrated, setRemoveUnrated] = useState(false);
    function onUnratedChange(event) {
        setRemoveUnrated(event.target.checked);
    }

    const [removeCompleted, setRemoveCompleted] = useState(false);
    function onCompletedChange(event) {
        setRemoveCompleted(event.target.checked);
    }

    const [difficulty, setDifficulty] = useState(0);
    function onDifficultyChange(val) {
        setDifficulty(val.key);
    }

    const [creator, setCreator] = useState('');
    function onCreatorChange(event) {
        setCreator(event.target.value);
    }

    const [song, setSong] = useState('');
    function onSongChange(event) {
        setSong(event.target.value);
    }

    useEffect(() => {
        filter({
            lowTier,
            highTier,
            difficulty,
            removeUnrated,
            creator,
            song
        });
    }, [lowTier, highTier, difficulty, removeUnrated, creator, song]);

    function reset() {
        setLowTier('');
        setHighTier('');
        setDifficulty(0);
        setRemoveUnrated(false);
        setRemoveCompleted(false);
        setCreator('');
        setSong('');
    }

    return (
        <div id="filter-menu" style={{ height: '0px'}}>
            <div className='wrapper'>
                <div className='content'>
                    <div className='d-flex justify-content-between mb-3'>
                        <h2 className='m-0'>Filters</h2>
                        <button className='btn btn-danger' onClick={reset}>Reset</button>
                    </div>
                    <div className='row row-gap-3 gap-xl-3'>
                        <div className='col-sm-5 col-lg-4 col-xl-3'>
                            <p className='form-label m-0'>Tier range:</p>
                            <div className='d-flex align-items-center'>
                                <input type='number' min='1' max='35' value={lowTier} onChange={onLowTierChange} />
                                <p className='m-0 mx-2'>to</p>
                                <input type='number' min='1' max='35' value={highTier} onChange={onHighTierChange} />
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
                        <div className='col-lg-5 col-xl-3'>
                            <p className='form-label m-0'>Creator:</p>
                            <input value={creator} onChange={onCreatorChange} />
                        </div>
                        <div className='col-md-7 col-lg-6 col-xl-3'>
                            <p className='form-label m-0'>Song:</p>
                            <input value={song} onChange={onSongChange} />
                        </div>
                        <div className='col-md-5 col-lg-4'>
                            <div className='form-check'>
                                <input type='checkbox' className='form-check-input' checked={removeUnrated} onChange={onUnratedChange} />
                                <label className='form-check-label'>Exclude unrated</label>
                            </div>
                            <div className='form-check'>
                                <input type='checkbox' className='form-check-input' checked={removeCompleted} onChange={onCompletedChange} disabled={!sessionID} />
                                <label className='form-check-label'>Exclude completed</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}