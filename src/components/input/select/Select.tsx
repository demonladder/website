import { useEffect, useRef, useState } from 'react';
import TonalButton from '../buttons/tonal/TonalButton';

interface Props<S, K> {
    label: string | React.ReactNode;
    icon?: React.ReactNode;
    options: S;
    onOption?: (key: K) => void;
    id?: string;
}

export default function Select<S extends Record<string, string>, K = S[keyof S]>({ label, icon, options, onOption, id }: Props<S, K>) {
    const [show, setShow] = useState(false);
    const menuRef = useRef<HTMLUListElement>(null);

    function onClick(key: K) {
        setShow((prev) => !prev);
        onOption?.(key);
    }

    function mouseMove(e: MouseEvent) {  // Auto close sort menu when mouse wanders too far
        const menu = menuRef.current;
        if (!menu) return;
        const rect = menu.getBoundingClientRect();
        const dist = 100;

        if (e.clientX < rect.x - dist ||
            e.clientX > rect.x + rect.width + dist ||
            e.clientY < rect.y - dist ||
            e.clientY > rect.y + rect.height + dist) {
            setShow(false);
        }
    }

    useEffect(() => {
        window.addEventListener('mousemove', mouseMove);

        return () => {
            window.removeEventListener('mousemove', mouseMove);
        };
    }, []);

    return (
        <>
            {show && <div className='absolute inset-0 z-10' onClick={() => setShow(false)} />}
            <div className='relative inline-block z-20' id={id}>
                <TonalButton size='xs' icon={icon} isSelected={show} onClick={() => setShow((prev) => !prev)}>{label}</TonalButton>
                <ul ref={menuRef} className={'absolute z-50 py-2 rounded round:rounded-lg min-w-28 max-w-60 bg-theme-600 transition-opacity ' + (show ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
                    {Object.entries(options).map(([key, value]) => (
                        <li key={key}>
                            <button className='h-12 px-3 text-start w-full hover:bg-theme-700 transition-colors' onClick={() => onClick(key as K)}>{value}</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
