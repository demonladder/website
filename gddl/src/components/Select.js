import React, { useEffect, useState } from 'react';

export default function Select({ options, onChange }) {
    const [open, setOpen] = useState(false);
    const [openStatus, setOpenStatus] = useState('closed');
    const [value, setValue] = useState(options[0]);

    const animTime = 200;

    function handleToggle() {
        if (openStatus === 'opening' || openStatus === 'closing') return;

        setOpen(prev => !prev);
        if (open) {
            setOpenStatus('closing');
            setTimeout(() => {
                setOpenStatus('closed');
            }, animTime);
        } else {
            setOpenStatus('opening');
            setTimeout(() => {
                setOpenStatus('open');
            }, animTime);
        }
    }

    useEffect(() => {
        setOpen(false);
        setOpenStatus('closed');
        if (onChange) onChange(value);
    }, [value]);

    return (
        <div className='style-input custom-select' onClick={handleToggle}>
            {value.value}
            <div className={'select-options ' + openStatus}>
                {
                    options.map((o, i) => <SelectOption option={o} setValue={setValue} key={i} />)
                }
            </div>
        </div>
    );
}

function SelectOption({ option, setValue }) {
    function onClick() {
        setValue(option);
    }

    return (
        <p onClick={onClick}>{option.value}</p>
    );
}