import { useEffect, useState } from 'react';

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
    }, [id]);

    return (
        <div className='style-input custom-select cursor-pointer' onClick={() => setOpen(prev => !prev)}>
            <div id={id} className='bg-black bg-opacity-20 border-b-2 w-full ps-2'>
                {value.value}
                <div className={'selectOptionsWrapper absolute -translate-x-2 translate-y-1 overflow-hidden grid transition-[grid-template-rows'} style={{ gridTemplateRows: open ? '1fr' : '0fr'}}>
                    <div className='selectOptions min-h-0 bg-gray-700' style={{ zIndex }}>
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
        <p onClick={() => setValue(option)} className='hover:bg-gray-500 px-2 py-1'>{option.value}</p>
    );
}