import React, { useEffect, useState } from 'react';

export default function FilterMenu({ show, filter, sessionID }) {
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
    function onDifficultyChange(event) {
        setDifficulty(event.target.value);
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
        <div className={'menu' + (show ? '' : ' hidden')}>
            <div className='d-flex justify-content-between'>
                <h2 className='m-0'>Filters</h2>
                <button className='btn btn-secondary' onClick={reset}>Reset</button>
            </div>
            <div className='row my-4 row-gap-3 gap-xl-3'>
                <div className='col-sm-5 col-lg-4 col-xl-3'>
                    <label className='form-label'>Tier range:</label>
                    <div className='d-flex align-items-center'>
                        <input type='number' className='form-control' min='1' max='35' value={lowTier} onChange={onLowTierChange}></input>
                        <p className='m-0 mx-2'>to</p>
                        <input type='number' className='form-control' min='1' max='35' value={highTier} onChange={onHighTierChange}></input>
                    </div>
                </div>
                <div className='col-sm-5 col-md-4 col-lg-3 col-xl-2'>
                    <label className='form-label'>Difficulty:</label>
                    <select className='form-select form-control' value={difficulty} onChange={onDifficultyChange}>
                        <option value='0'></option>
                        <option value='1'>Official</option>
                        <option value='2'>Easy</option>
                        <option value='3'>Medium</option>
                        <option value='4'>Hard</option>
                        <option value='5'>Insane</option>
                        <option value='6'>Extreme</option>
                    </select>
                </div>
                <div className='col-lg-5 col-xl-3'>
                    <label className='form-label'>Creator:</label>
                    <input className='form-control' value={creator} onChange={onCreatorChange}></input>
                </div>
                <div className='col-md-7 col-lg-6 col-xl-3'>
                    <label className='form-label'>Song:</label>
                    <input className='form-control' value={song} onChange={onSongChange}></input>
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
    );
}