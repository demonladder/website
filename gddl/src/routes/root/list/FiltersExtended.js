import Cookies from 'js-cookie';
import React, { useEffect, useImperativeHandle, useState } from 'react';

export default function FiltersExtended({ set, resetRef }) {
    function toggleShow() {
        const content = document.querySelector('#extended-filters-menu .content');
        const bigContent = document.getElementById('filter-menu');
        
        content.classList.toggle('open');
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            bigContent.style.maxHeight = bigContent.scrollHeight + content.scrollHeight + 'px';
        }

        document.querySelector('#extended-filters-menu button.open-extended .open-spinner').classList.toggle('spin');  // Toggle 'V' upside down
    }

    const inSession = Cookies.get('sessionToken') != null;

    const [subLowCount, setSubLowCount] = useState('');
    const [subHighCount, setSubHighCount] = useState('');
    
    const [enjLowCount, setEnjLowCount] = useState('');
    const [enjHighCount, setEnjHighCount] = useState('');
    
    const [devLow, setDevLow] = useState('');
    const [devHigh, setDevHigh] = useState('');
    
    const [IDLow, setIDLow] = useState('');
    const [IDHigh, setIDHigh] = useState('');

    const [exactName, setExactName] = useState(false);

    const [removeUnrated, setRemoveUnrated] = useState(false);
    const [removeUnratedEnj, setRemoveUnratedEnj] = useState(false);
    const [removeRated, setRemoveRated] = useState(false);
    const [removeRatedEnj, setRemoveRatedEnj] = useState(false);

    const [removeCompleted, setRemoveCompleted] = useState(false);

    useEffect(() => {
        set({
            subLowCount,
            subHighCount,
            enjLowCount,
            enjHighCount,
            devLow,
            devHigh,
            exactName,
            removeUnrated,
            removeUnratedEnj,
            removeRated,
            removeRatedEnj
        });
    }, [subLowCount, subHighCount, enjLowCount, enjHighCount, devLow, devHigh, exactName, removeUnrated, removeUnratedEnj, removeRated, removeRatedEnj]);

    useImperativeHandle(resetRef, () => ({
        reset() {        
            setSubLowCount('');
            setSubHighCount('');
            setEnjLowCount('');
            setEnjHighCount('');
            setDevLow('');
            setDevHigh('');
            setExactName(false);
            setRemoveUnrated(false);
            setRemoveUnratedEnj(false);
            setRemoveRated(false);
            setRemoveRatedEnj(false);
            setRemoveCompleted(false);
        }
    }))

    return (
        <div id='extended-filters-menu'>
            <button className='open-extended' onClick={toggleShow}>
                <b>
                    Extra filters
                    <span className='open-spinner'>V</span>
                </b>
            </button>
            <div className='content'>
                <div className='d-flex flex-column gap-3'>
                    <div className='d-flex flex-wrap gap-4 row-gap-3'>
                        <div>
                            <p className='form-label m-0'>Submission count:</p>
                            <div className='d-flex align-items-center'>
                                <input type='number' className='num-sm' value={subLowCount} min='1' max='1000' onChange={(e) => setSubLowCount(e.target.value)} />
                                <p className='m-0 mx-2'>to</p>
                                <input type='number' className='num-sm' value={subHighCount} min='1' max='1000' onChange={(e) => setSubHighCount(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <p className='form-label m-0'>Enjoyment count:</p>
                            <div className='d-flex align-items-center'>
                                <input type='number' className='num-sm' value={enjLowCount} min='1' max='1000' onChange={(e) => setEnjLowCount(e.target.value)} />
                                <p className='m-0 mx-2'>to</p>
                                <input type='number' className='num-sm' value={enjHighCount} min='1' max='1000' onChange={(e) => setEnjHighCount(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <p className='form-label m-0'>Deviation:</p>
                            <div className='d-flex align-items-center'>
                                <input type='number' className='num-lg' value={devLow} min='1' max='10' onChange={(e) => setDevLow(e.target.value)} />
                                <p className='m-0 mx-2'>to</p>
                                <input type='number' className='num-lg' value={devHigh} min='1' max='10' onChange={(e) => setDevHigh(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <p className='form-label m-0'>Level ID:</p>
                            <div className='d-flex align-items-center'>
                                <input type='number' className='num-lg' value={IDLow} min='1' max='500000000' onChange={(e) => setIDLow(e.target.value)} />
                                <p className='m-0 mx-2'>to</p>
                                <input type='number' className='num-lg' value={IDHigh} min='1' max='500000000' onChange={(e) => setIDHigh(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <label className='col-12 col-lg-6 col-xl-4 d-flex align-items-center gap-2'>
                            <input type='checkbox' checked={exactName} onChange={() => setExactName(prev => !prev)} />
                            Exact name search
                        </label>
                        <label className='col-12 col-lg-6 col-xl-4 d-flex align-items-center gap-2'>
                            <input type='checkbox' checked={removeCompleted} onChange={() => setRemoveCompleted(prev => !prev)} disabled={!inSession} />
                            Exclude completed
                        </label>
                        <label className='col-12 col-lg-6 col-xl-4 d-flex align-items-center gap-2'>
                            <input type='checkbox' checked={removeUnrated} onChange={() => setRemoveUnrated(prev => !prev)} />
                            Exclude unrated tier
                        </label>
                        <label className='col-12 col-lg-6 col-xl-4 d-flex align-items-center gap-2'>
                            <input type='checkbox' checked={removeUnratedEnj} onChange={() => setRemoveUnratedEnj(prev => !prev)} />
                            Exclude unrated enjoyment
                        </label>
                        <label className='col-12 col-lg-6 col-xl-4 d-flex align-items-center gap-2'>
                            <input type='checkbox' checked={removeRated} onChange={() => setRemoveRated(prev => !prev)} />
                            Exclude rated tier
                        </label>
                        <label className='col-12 col-xl-4 d-flex align-items-center gap-2'>
                            <input type='checkbox' checked={removeRatedEnj} onChange={() => setRemoveRatedEnj(prev => !prev)} />
                            Exclude rated enjoyment
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}