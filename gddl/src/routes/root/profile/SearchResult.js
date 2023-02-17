import React from 'react';

export default function SearchResult({ level, setSearch }) {
    function clickHandler() {
        setSearch(level.Name)
    }

    return (
        <div className='result' onClick={clickHandler}>
            <b>{level.Name}</b>
            <span> by {level.Creator}</span>
        </div>
    );
}