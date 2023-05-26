import React, { useState } from 'react';

export default function Select({ options, onChange, zIndex = 1000 }) {
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

    function optionClicked(option) {
        setOpen(false);
        setOpenStatus('closed');
        setValue(option);
        if (onChange) onChange(option);
    }

    return (
        <div className='style-input custom-select' onClick={handleToggle}>
            {value.value}
            <div className={'select-options ' + openStatus} style={{ zIndex }}>
                {
                    options.map((o, i) => <SelectOption option={o} setValue={optionClicked} key={i} />)
                }
            </div>
        </div>
    );
}

function SelectOption({ option, setValue }) {
    return (
        <p onClick={() => setValue(option)}>{option.value}</p>
    );
}