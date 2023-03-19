import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function Save({ show, onSave, onCancel, loading }) {
    return (
        <div className={'save-dialogue' + (show ? ' show' : '')}>
            <div className='header'>
                <h5>Save changes?</h5>
                <LoadingSpinner isLoading={loading} />
            </div>
            <div className='wrapper'>
                <button className='primary' onClick={onSave}>Save</button>
                <button className='secondary' onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}