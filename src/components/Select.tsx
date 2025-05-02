import { useEffect, useState } from 'react';
import { KeyboardAccessibility } from '../utils/KeyboardAccessibility';

interface Props<T extends { [key: string | number]: string}> {
    options: T;
    activeKey: keyof T;
    onChange: (option: keyof T) => void;
    invalid?: boolean;
    zIndex?: number;
    height?: string;
    id: string;
}

export default function Select<T extends { [key: string]: string}>({ options, activeKey, onChange, invalid = false, height, id }: Props<T>) {
    const [open, setOpen] = useState(false);

    function toggleMenu() {
        setOpen((prev) => !prev);
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
        };
    }, [id]);

    return (
        <div className='cursor-pointer select-none relative' tabIndex={0} onClick={toggleMenu} onKeyDown={KeyboardAccessibility.onSelect(toggleMenu)}>
            <div id={id} className={'bg-theme-950/70 border-b-2 w-full ps-2' + (invalid ? ' border-red-600' : '')}>
                {options[activeKey]}
                <div className={'shadow-2xl absolute z-10 -translate-x-2 translate-y-[2px] overflow-hidden grid transition-[grid-template-rows]'} style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
                    <ul className={`bg-theme-600 max-h-${height ?? '44'} overflow-y-scroll`} style={{ maxHeight: height ? `${(parseInt(height) / 4).toFixed(2)}rem` : '11rem' }}>
                        {Object.entries(options).map((o) => <SelectOption option={o} setValue={onChange} key={o[0] + '_0'} />)}
                    </ul>
                </div>
            </div>
            <i className='bx bx-caret-down absolute top-0 right-1' />
        </div>
    );
}

function SelectOption<T>({ option, setValue }: { option: [T, string], setValue: (option: T) => void }) {
    function handleClick() {
        setValue(option[0]);
    }

    return (
        <li onClick={handleClick} tabIndex={0} onKeyDown={KeyboardAccessibility.onSelect(handleClick)} className='hover:bg-theme-500 px-2 py-1'>{option[1]}</li>
    );
}
