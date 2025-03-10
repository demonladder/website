import { useEffect, useState } from 'react';
import { KeyboardAccessibility } from '../utils/KeyboardAccessibility';

interface Props {
    options: { [key: string]: string } | { key: string, value: string }[];
    activeKey: string;
    onChange: (option: string) => void;
    invalid?: boolean;
    zIndex?: number;
    height?: string;
    id: string;
}

export default function Select({ options, activeKey, onChange, invalid = false, height, id }: Props) {
    const [open, setOpen] = useState(false);

    function optionClicked(option: string) {
        onChange(option);
    }

    function openMenu() {
        setOpen(prev => !prev)
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
        <div className='cursor-pointer select-none relative' tabIndex={0} onClick={openMenu} onKeyDown={KeyboardAccessibility.onSelect(openMenu)}>
            <div id={id} className={'bg-black/20 border-b-2 w-full ps-2' + (invalid ? ' border-red-600' : '')}>
                {!Array.isArray(options)
                    ? options[activeKey]
                    : options.find((o) => o.key === activeKey)?.value
                }
                <div className={'shadow-2xl absolute z-10 -translate-x-2 translate-y-[2px] overflow-hidden grid transition-[grid-template-rows]'} style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                    <ul className={`bg-gray-600 max-h-${height ?? '44'} overflow-y-scroll`} style={{ maxHeight: height ? `${(parseInt(height) / 4).toFixed(2)}rem` : '11rem' }}>
                        {!Array.isArray(options)
                            ? Object.entries(options).map((o) => <SelectOption option={o} setValue={optionClicked} key={o[0] + '_0'} />)
                            : options.map((o) => <SelectOption option={[o.key, o.value]} setValue={optionClicked} key={o.key + '_1'} />)
                        }
                    </ul>
                </div>
            </div>
            <i className='bx bx-caret-down absolute top-0 right-1' />
        </div>
    );
}

function SelectOption({ option, setValue }: { option: [string, string], setValue: (option: string) => void }) {
    function handleClick() {
        setValue(option[0])
    }

    return (
        <li onClick={handleClick} tabIndex={0} onKeyDown={KeyboardAccessibility.onSelect(handleClick)} className='hover:bg-gray-500 px-2 py-1'>{option[1]}</li>
    );
}
