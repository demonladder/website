import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import SearchResult from './SearchResult';

type Props = {
    list: any[],
    update: (a: string) => void,
    setResult: (result: any) => void,
    status: string,
}

// This component is base class for search boxes.
// It does not handle queries or decide what gets displayed.
export default function SearchBox({ list, update, setResult, status }: Props) {
    const [search, setSearch] = useState('');  // The value the user types into the input field
    const [visible, setVisible] = useState(false);  // State of the search results

    // When the search changes, wait a bit before telling the parent
    const [timer, setTimer] = useState(-1);
    function onChange(e: any) {
        setSearch(e.target.value);
        clearTimeout(timer);
        setTimer((setTimeout(() => {
            update(search);
        }, 300) as unknown) as number);
    }

    // Hide the results after some time when user clicks off
    function handleBlur() {
        setTimeout(() => {
            setVisible(false);
        }, 300);
    }

    // When the user clicks a result, set search state and pass the clicked result to parent
    function handleClick(r: any) {
        setSearch(r.Name);
        setResult(r);
    }

    return (
        <div className='search-box'>
            <input type='text' value={search} onChange={onChange} onFocus={() => setVisible(true)} onBlur={handleBlur} />
            <div className={(visible ? 'd-block' : 'd-none') + ' search-result'}>
                {status === 'loading' ?
                    <LoadingSpinner /> :
                    ((status === 'error' || list.length === 0) ? <p>No results</p> :
                    list.map(r => <SearchResult msg={r.label} onClick={() => handleClick(r)} key={r.label} />))
                }
            </div>
        </div>
    );
}