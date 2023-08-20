import { useEffect, useState } from 'react';

export type SelectOption = {
    key: number,
    value: string,
}

type Props = {
    options: {[key: string]: string},
    activeKey: string,
    onChange: (option: string) => void,
    zIndex?: number,
    id: string,
}

export default function Select({ options, activeKey, onChange, id }: Props) {
    const [open, setOpen] = useState(false);

    function optionClicked(option: string) {
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
        <div className='cursor-pointer select-none relative' onClick={() => setOpen(prev => !prev)}>
            <div id={id} className='bg-black bg-opacity-20 border-b-2 w-full ps-2'>
                {options[activeKey]}
                <div className={'shadow-2xl absolute z-10 -translate-x-2 translate-y-[2px] overflow-hidden grid transition-[grid-template-rows'} style={{ gridTemplateRows: open ? '1fr' : '0fr'}}>
                    <div className='min-h-0 w-40 bg-gray-600 max-h-44 overflow-auto'>
                        {
                            Object.entries(options).map((o) => <SelectOption option={o} setValue={optionClicked} key={o[0]} />)
                        }
                    </div>
                </div>
            </div>
            <div className='absolute top-0 right-1'>
                <i className='bx bx-caret-down'></i>
            </div>
        </div>
    );
}

function SelectOption({ option, setValue }: {option: [string, string], setValue: (option: string) => void}) {
    return (
        <p onClick={() => setValue(option[0])} className='hover:bg-gray-500 px-2 py-1'>{option[1]}</p>
    );
}