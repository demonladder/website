import { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import SearchResult from './SearchResult';
import { TextInput } from '../Input';

interface Props<T> {
    list: T[],
    update: (a: string) => void,
    setResult: (result: T|null) => void,
    status: string,
    id?: string,
    placeholder?: string,
    invalid?: boolean,
}

// This component is base class for search boxes.
// It does not handle queries or decide what gets displayed.
export default function SearchBox({ list, update, setResult, status, id, placeholder = 'Search...', invalid = false }: Props<any>) {
    const [search, setSearch] = useState('');  // The value the user types into the input field
    const [visible, setVisible] = useState(false);  // State of the search results

    // When the search changes, wait a bit before telling the parent
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    function onChange(e: any) {
        setResult(undefined);
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
        <div>
            <TextInput id={id} onKeyDown={keyDown} value={search} placeholder={placeholder} onChange={onChange} onFocus={() => setVisible(true)} invalid={invalid} />
            {/* <div className={(visible ? 'block' : 'hidden') + ' absolute bg-gray-600 text-white'} style={{ zIndex: 5 }}> */}
            <div className={(visible ? 'block' : 'hidden') + ' absolute bg-gray-600 round:rounded-b-lg text-white text-base z-10'}>
                {status === 'loading' ?
                    <LoadingSpinner /> :
                    ((status === 'error' || list.length === 0) ? <div className='px-2 py-1'><p>No results</p></div> :
                    list.map(r => <SearchResult msg={r.label} onClick={() => handleClick(r)} key={r.label} />))
                }
            </div>
        </div>
    );
};