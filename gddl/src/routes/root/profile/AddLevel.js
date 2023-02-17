import React, { useEffect, useState } from 'react';
import serverIP from '../../../serverIP';
import SearchResult from './SearchResult';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

export default function AddLevel({ setProgress }) {

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);

    const [timer, setTimer] = useState();
    useEffect(() => {
        clearTimeout(timer);
        setTimer(setTimeout(() => {
            fetch(`${serverIP}/getLevels?page=0&chunk=5&name=${search}`, {
                credentials: 'include'
            }).then(res => res.json())
            .then(data => {
                setResults(data.levels);
            }).catch(e => {
                console.error(e);
            });
        }, 300));
    }, [search]);

    const [resultVisible, setResultVisible] = useState(false);
    function handleBlur() {
        setTimeout(() => {
            setResultVisible(false);
        }, 100);
    }

    const [percent, setPercent] = useState(0);
    function onPercentChange(e) {
        let p = e.target.value;

        if (p > 100) {
            return;
        }
        if (p.includes('-') || p.includes('.')) {
            return;
        }

        setPercent(p);
    }

    function onSubmit() {
        if (results.length > 1) {
            console.log('Too many results!');
            return;
        } else if (results.length === 0) {
            console.log('No results!');
            return;
        }

        // Submit here
        const level = results[0];
        level.Progress = percent || 100;
        level.LevelID = level.ID;
        setProgress(prev => [...prev, level]);
    }

    const params = useParams();
    if (Cookies.get('userID') !== params.userID) return;

    return (
        <div className='my-3'>
            <label className='h5 me-2 mb-0 align-self-center'>Add level:</label>
            <div className='position-relative d-inline-block'>
                <div className='row'>
                    <div className='col-auto'>
                        <input className='form-control' type='text' value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => setResultVisible(true)} onBlur={handleBlur} placeholder='Level name...' />
                    </div>
                    <div className='col-3'>
                        <input className='form-control' type='number' placeholder='100' value={percent} onChange={onPercentChange} />
                    </div>
                    <div className='col-3'>
                        <button className='btn btn-primary' onClick={onSubmit}>Submit</button>
                    </div>
                </div>
                <div className={(resultVisible ? 'd-block' : 'd-none') + ' search-result'}>
                    {results.map(r => <SearchResult level={r} setSearch={setSearch} key={r.ID} />)}
                </div>
            </div>
        </div>
    )
}