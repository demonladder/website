import React from 'react';
import './FilterMenu.css';

export default function FilterMenu({ show }) {
    return (
        <div className={'menu ' + (show ? '' : 'hidden')}>
            <h2>Filters</h2>
            <div className='row'>
                <div className='col'>
                    <label>Tier range:</label>
                    <div className='d-flex'>
                        <input className='number'></input>
                        <p className='m-0 mx-2'>-</p>
                        <input className='number'></input>
                    </div>
                </div>
                <div className='col'>
                    <label>Difficulty:</label>
                    <div>
                        <select>
                            <option value='1'>Official</option>
                            <option value='2'>Easy</option>
                            <option value='3'>Medium</option>
                            <option value='4'>Hard</option>
                            <option value='5'>Insane</option>
                            <option value='6'>Extreme</option>
                        </select>
                    </div>
                </div>
                <div className='col'>

                </div>
            </div>
        </div>
    );
}