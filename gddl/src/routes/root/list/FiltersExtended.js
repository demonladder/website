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

        document.querySelector('#extended-filters-menu button.open-extended .open-spinner').classList.toggle('spin');
    }

    const [subLowCount, setSubLowCount] = useState('');
    const [subHighCount, setSubHighCount] = useState('');
    
    const [enjLowCount, setEnjLowCount] = useState('');
    const [enjHighCount, setEnjHighCount] = useState('');
    
    const [devLow, setDevLow] = useState('');
    const [devHigh, setDevHigh] = useState('');

    useEffect(() => {
        set({
            subLowCount,
            subHighCount,
            enjLowCount,
            enjHighCount,
            devLow,
            devHigh
        });
    }, [subLowCount, subHighCount, enjLowCount, enjHighCount, devLow, devHigh]);

    useImperativeHandle(resetRef, () => ({
        reset() {        
            setSubLowCount('');
            setSubHighCount('');
            setEnjLowCount('');
            setEnjHighCount('');
            setDevLow('');
            setDevHigh('');
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
                <div className='d-flex flex-wrap gap-5'>
                    <div>
                        <p className='form-label m-0'>Submission count:</p>
                        <div className='d-flex align-items-center'>
                            <input type='number' className='num-sm' value={subLowCount} min='1' max='10' onChange={(e) => setSubLowCount(e.target.value)} />
                            <p className='m-0 mx-2'>to</p>
                            <input type='number' className='num-sm' value={subHighCount} min='1' max='10' onChange={(e) => setSubHighCount(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <p className='form-label m-0'>Enjoyment count:</p>
                        <div className='d-flex align-items-center'>
                            <input type='number' className='num-sm' value={enjLowCount} min='1' max='10' onChange={(e) => setEnjLowCount(e.target.value)} />
                            <p className='m-0 mx-2'>to</p>
                            <input type='number' className='num-sm' value={enjHighCount} min='1' max='10' onChange={(e) => setEnjHighCount(e.target.value)} />
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
                </div>
            </div>
        </div>
    );
}