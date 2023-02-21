import React from 'react';

export default function SearchResult({ level, setSearch, setID }) {
    function clickHandler() {
        setSearch(level.Name)
        setID(level.ID);
    }

    return (
        <div className='result' onClick={clickHandler}>
            <b>{level.Name}</b>
            <span> by {level.Creator}</span>
        </div>
    );
}