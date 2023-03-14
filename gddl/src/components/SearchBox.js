import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import SearchResult from './SearchResult';

export default function SearchBox({ list, update, setResult, status }) {
    const [search, setSearch] = useState('');
    const [visible, setVisible] = useState(false);

    function handleChange(e) {
        setSearch(e.target.value);
    }

    const [timer, setTimer] = useState();
    useEffect(() => {
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            update(search);
        }, 300));
    }, [search]);

    function handleBlur() {
        setTimeout(() => {
            setVisible(false);
        }, 300);
    }

    function handleClick(r) {
        setSearch(r.Name);
        setResult(r);
    }

    return (
        <div className='position-relative'>
            <input type='text' value={search} onChange={handleChange} onFocus={() => setVisible(true)} onBlur={handleBlur} />
            <div className={(visible ? 'd-block' : 'd-none') + ' search-result'}>
                {status === 'loading' ?
                    <LoadingSpinner /> :
                    (status === 'error' ? <p>Couldn't connect to the server</p> :
                    list.map(r => <SearchResult msg={r.label} onClick={() => handleClick(r)} key={r.label} />))
                }
            </div>
        </div>
    );
}