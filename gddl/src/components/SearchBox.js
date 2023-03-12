import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import SearchResult from './SearchResult';

export default function SearchBox({ dataFn, descriptor, setFirst }) {
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [resultVisible, setResultVisible] = useState(false);

    function handleChange(e) {
        setSearch(e.target.value);
    }

    const [timer, setTimer] = useState();
    useEffect(() => {
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            dataFn(search).then(data => {
                setFirst(data[0] || null);
                setResult(data);
            });
        }, 300));
    }, [search]);

    function handleBlur() {
        setTimeout(() => {
            setResultVisible(false);
        }, 300);
    }

    return (
        <div className='position-relative'>
            <Form.Control type='text' value={search} onChange={handleChange} onFocus={() => setResultVisible(true)} onBlur={handleBlur} />
            <div className={(resultVisible ? 'd-block' : 'd-none') + ' search-result'}>
                {
                    result.map(r => <SearchResult msg={r[descriptor]} onClick={() => setSearch(r[descriptor])} key={r.ID} />)
                }
            </div>
        </div>
    );
}