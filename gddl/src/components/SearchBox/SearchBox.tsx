import { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import SearchResult from './SearchResult';
import { TextInput } from '../Input';

interface Props<T> {
    search: string;
    onSearchChange: (search: string) => void;
    list: T[];
    onDelayedChange: (a: string) => void;
    setResult: (result: T | undefined) => void;
    status: string;
    id?: string;
    placeholder?: string;
    invalid?: boolean;
}

interface BaseType {
    label: string;
    Name: string;
}



// This component is base class for search boxes.
// It does not handle queries or decide what gets displayed.
export default function SearchBox<T extends BaseType>({ search, onSearchChange, list, onDelayedChange, setResult, status, id, placeholder = 'Search...', invalid = false }: Props<T>) {
    const [visible, setVisible] = useState(false);  // State of the search results

    // When the search changes, wait a bit before telling the parent
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setResult(undefined);
        console.log('Search box has changed');
        
        
        onSearchChange(e.target.value);
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            onDelayedChange(e.target.value);
        }, 300));
    }

    useEffect(() => {
        function onClick(e: MouseEvent) {
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
    function handleClick(r: T) {
        onSearchChange(r.Name);
        setResult(r);
    }

    function keyDown(event: React.KeyboardEvent) {
        if (event.key === 'Enter') {
            handleClick(list[0]);
        }
    }
    
    return (
        <div>
            <TextInput value={search} id={id} onKeyDown={keyDown} placeholder={placeholder} onChange={onChange} onFocus={() => setVisible(true)} invalid={invalid} />
            {/* <div className={(visible ? 'block' : 'hidden') + ' absolute bg-gray-600 text-white'} style={{ zIndex: 5 }}> */}
            <div className={(visible ? 'block' : 'hidden') + ' absolute bg-gray-600 round:rounded-b-lg text-white text-base z-10 shadow-2xl'}>
                {status === 'loading'
                    ? <LoadingSpinner />
                    : ((status === 'error' || list.length === 0)
                        ? <div className='px-2 py-1'><p>No results</p></div>
                        : list.map(r => <SearchResult msg={r.label} onClick={() => handleClick(r)} key={r.label} />))
                }
            </div>
        </div>
    );
}