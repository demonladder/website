import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import SearchResult from './SearchResult';

type Props = {
    list: any[],
    update: (a: string) => void,
    setResult: (result: any) => void,
    status: string,
    id?: string,
    className?: string,
}

// This component is base class for search boxes.
// It does not handle queries or decide what gets displayed.
export default function SearchBox({ list, update, setResult, status, id, className }: Props) {
    const [search, setSearch] = useState('');  // The value the user types into the input field
    const [visible, setVisible] = useState(false);  // State of the search results

    // When the search changes, wait a bit before telling the parent
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    function onChange(e: any) {
        setSearch(e.target.value);
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            update(e.target.value);
        }, 300));
    }

    useEffect(() => {
        function onClick(e: any) {
            if (id === undefined) return;
    
            if (e.target !== document.getElementById(id)) {
                setVisible(false);
            }
        }

        document.addEventListener('click', onClick);

        return () => {
            document.removeEventListener('click', onClick);
        }
    }, [id]);

    // When the user clicks a result, set search state and pass the clicked result to parent
    function handleClick(r: any) {
        setSearch(r.Name);
        setResult(r);
    }

    function keyDown(event: any) {
        if (event.key === 'Enter') {
            handleClick(list[0]);
        }
    }
    
    return (
        <div className={'search-box ' + ((className && className) || '')}>
            <input id={id} type='text' onKeyDown={keyDown} value={search} placeholder='Search...' onChange={onChange} onFocus={() => setVisible(true)} />
            <div className={(visible ? 'd-block' : 'd-none') + ' search-result'} style={{zIndex: 5}}>
                {status === 'loading' ?
                    <LoadingSpinner /> :
                    ((status === 'error' || list.length === 0) ? <p>No results</p> :
                    list.map(r => <SearchResult msg={r.label} onClick={() => handleClick(r)} key={r.label} />))
                }
            </div>
        </div>
    );
}