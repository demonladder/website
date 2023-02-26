import React from 'react';

export default function SearchResult({ msg, onClick }) {
    return (
        <div className='result'>
            <p className='m-0' onClick={onClick}>{msg}</p>
        </div>
    );
}