import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import SearchResult from './SearchResult';
import './styles.scss';

type ListItem = {
    label: string;
}

// This component is base class for search boxes.
// It does not handle queries or decide what gets displayed.
export default function SearchBox<T extends ListItem>({ list, update, setResult, status, id, className, placeholder = 'Search...' }: {
    list: T[],
    update: (a: string) => void,
    setResult: (result: T) => void,
    status: string,
    id?: string,
    className?: string,
    placeholder?: string,
}) {
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
        <div className={'searchBox ' + ((className && className) || '')}>
            <input id={id} type='text' onKeyDown={keyDown} value={search} placeholder={placeholder} onChange={onChange} onFocus={() => setVisible(true)} />
            <div className={(visible ? 'd-block' : 'd-none') + ' searchResult'} style={{zIndex: 5}}>
                {status === 'loading' ?
                    <LoadingSpinner /> :
                    ((status === 'error' || list.length === 0) ? <p>No results</p> :
                    list.map(r => <SearchResult msg={r.label} onClick={() => handleClick(r)} key={r.label} />))
                }
            </div>
        </div>
    );
}