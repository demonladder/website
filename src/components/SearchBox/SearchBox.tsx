import { useEffect, useRef, useState } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import SearchResult from './SearchResult';
import { useEventListener } from 'usehooks-ts';
import { TextInput } from '../Input';

interface Props<T> {
    value?: string;
    onChange: (search: string) => void;
    onDebouncedChange?: (search: string) => void;
    list: T[];
    onResult?: (result: T | undefined) => void;
    status: string;
    id?: string;
    placeholder?: string;
    invalid?: boolean;
    getLabel: (result: T) => string;
    getName: (result: T) => string;
    overWriteInput?: boolean;
}



// This component is base class for search boxes.
// It does not handle queries or decide what gets displayed.
export default function SearchBox<T>({ value = '', onChange: setChange, onDebouncedChange, list, getLabel, onResult: setResult, status, id, placeholder = 'Search...', invalid = false }: Props<T>) {
    const [visible, setVisible] = useState(false);  // State of the search results
    const timer = useRef<NodeJS.Timeout>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!onDebouncedChange) return;

        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            onDebouncedChange(value);
        }, 500);

        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, [onDebouncedChange, setChange, value]);

    useEventListener('click', (e) => {
        if (id === undefined) return;

        if (e.target !== document.getElementById(id)) {
            setVisible(false);
        }
    });

    // When the user clicks a result, set search state and pass the clicked result to parent
    function handleClick(r: T | undefined) {
        setResult?.(r);
        setVisible(false);
    }

    function keyDown(event: React.KeyboardEvent) {
        if (event.key === 'Enter') {
            const firstEntry = list.at(0);
            if (value !== '') setResult?.(firstEntry);
            else setResult?.(undefined);
            if (inputRef.current) inputRef.current.blur();
            setVisible(false);
        }
    }

    return (
        <div>
            <TextInput ref={inputRef} value={value} id={id} onKeyDown={keyDown} placeholder={placeholder} onChange={(e) => setChange(e.target.value)} onFocus={() => setVisible(true)} invalid={invalid} />
            <div className={(visible ? 'block' : 'hidden') + ' absolute bg-theme-900 p-1 border border-t-0 border-theme-400 text-theme-text round:rounded-b-lg text-base z-10 shadow-2xl'}>
                {status === 'pending'
                    ? <LoadingSpinner />
                    : ((status === 'error' || list.length === 0)
                        ? <div className='px-2 py-1'><p>No results</p></div>
                        : list.map(r => <SearchResult msg={getLabel(r)} onClick={() => handleClick(r)} key={getLabel(r)} />))
                }
            </div>
        </div>
    );
}
