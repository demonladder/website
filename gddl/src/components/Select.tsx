import React, { useEffect, useState } from 'react';

export type SelectOption = {
    key: number,
    value: string,
}

type Props = {
    options: SelectOption[],
    onChange: (option: SelectOption) => void,
    zIndex?: number,
    id: string,
}

export default function Select({ options, onChange, zIndex = 1001, id }: Props) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(options[0]);

    function optionClicked(option: SelectOption) {
        setValue(option);
        onChange(option);
    }

    useEffect(() => {
        function onClick(e: MouseEvent) {
            if (e.target !== document.getElementById(id)) {
                setOpen(false);
            }
        }

        document.addEventListener('click', onClick);

        return () => {
            document.removeEventListener('click', onClick);
        }
    }, []);

    return (
        <div className='style-input custom-select' onClick={() => setOpen(prev => !prev)}>
            <div id={id} className='selectWrapper'>
                {value.value}
                <div className={'selectOptionsWrapper' + (open ? ' show' : '')}>
                    <div className='selectOptions' style={{ zIndex }}>
                        {
                            options.map((o) => <SelectOption option={o} setValue={optionClicked} key={o.value} />)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

function SelectOption({ option, setValue }: {option: SelectOption, setValue: (option: SelectOption) => void}) {
    return (
        <p onClick={() => setValue(option)}>{option.value}</p>
    );
}