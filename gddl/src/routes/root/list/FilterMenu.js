import React, { useEffect, useState } from 'react';
import './FilterMenu.css';

export default function FilterMenu({ show, filter }) {
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
        setDifficulty('0');
        setRemoveUnrated(false);
        setCreator('');
        setSong('');
    }

    return (
        <div className={'menu ' + (show ? '' : 'hidden')}>
            <h2>Filters</h2>
            <div className='row my-4'>
                <div className='col'>
                    <label className='form-label'>Tier range:</label>
                    <div className='d-flex'>
                        <input type='number' className='form-control' min='1' max='35' value={lowTier} onChange={onLowTierChange}></input>
                        <p className='m-0 mx-2'>to</p>
                        <input type='number' className='form-control' min='1' max='35' value={highTier} onChange={onHighTierChange}></input>
                    </div>
                </div>
                <div className='col'>
                    <label className='form-label'>Difficulty:</label>
                    <select className='form-select form-control' value={difficulty} onChange={onDifficultyChange}>
                        <option value='0'></option>
                        <option value='Official'>Official</option>
                        <option value='Easy'>Easy</option>
                        <option value='Medium'>Medium</option>
                        <option value='Hard'>Hard</option>
                        <option value='Insane'>Insane</option>
                        <option value='Extreme'>Extreme</option>
                    </select>
                </div>
                <div className='col'>
                    <div className='form-check'>
                        <label className='form-check-label'>Exclude NC</label>
                        <input type='checkbox' className='form-check-input'></input>
                    </div>
                    <div className='form-check'>
                        <label className='form-check-label'>Remove unrated</label>
                        <input type='checkbox' className='form-check-input' checked={removeUnrated} onChange={onUnratedChange}></input>
                    </div>
                </div>
            </div>
            <div className='row my-4'>
                <div className='col-4'>
                    <label className='form-label'>Creator:</label>
                    <input className='form-control' value={creator} onChange={onCreatorChange}></input>
                </div>
                <div className='col-4'>
                    <label className='form-label'>Song:</label>
                    <input className='form-control' value={song} onChange={onSongChange}></input>
                </div>
            </div>
            <button className='btn btn-secondary' onClick={reset}>Reset</button>
        </div>
    );
}