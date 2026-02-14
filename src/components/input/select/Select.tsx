import { useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import { SecondaryButton } from '../../ui/buttons/SecondaryButton';

interface Props<S, K> {
    label: string | React.ReactNode;
    icon?: React.ReactNode;
    options: S;
    onOption?: (key: K) => void;
    id?: string;
}

export default function Select<S extends Record<string, string>, K = S[keyof S]>({
    label,
    icon,
    options,
    onOption,
    id,
}: Props<S, K>) {
    const [show, setShow] = useState(false);
    const menuRef = useRef<HTMLUListElement>(null);
    const [filter, setFilter] = useState('');

    function onClick(key: K) {
        setShow((prev) => !prev);
        onOption?.(key);
    }

    function mouseMove(e: MouseEvent) {
        // Auto close sort menu when mouse wanders too far
        const menu = menuRef.current;
        if (!menu) return;
        const rect = menu.getBoundingClientRect();
        const dist = 100;

        if (
            e.clientX < rect.x - dist ||
            e.clientX > rect.x + rect.width + dist ||
            e.clientY < rect.y - dist ||
            e.clientY > rect.y + rect.height + dist
        ) {
            setShow(false);
        }
    }

    useEventListener('mousemove', mouseMove);

    return (
        <>
            {show && <div className='absolute inset-0 z-30' onClick={() => setShow(false)} />}
            <div className='relative inline-block' id={id}>
                <SecondaryButton className='h-8 px-4' isPressedOverride={show} onClick={() => setShow((prev) => !prev)}>
                    {icon} {label}
                </SecondaryButton>
                <ul
                    ref={menuRef}
                    className={
                        'absolute z-40 p-1 round:rounded-lg min-w-28 bg-theme-900 border border-theme-400 shadow-2xl transition-opacity ' +
                        (show ? 'opacity-100' : 'opacity-0 pointer-events-none')
                    }
                >
                    <li>
                        <input
                            type='text'
                            className='w-full px-4 py-1 outline-none'
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder='Search...'
                        />
                    </li>
                    {Object.entries(options)
                        .filter(([_, value]) => value.toLowerCase().startsWith(filter.toLowerCase()))
                        .map(([key, value]) => (
                            <li key={key}>
                                <button
                                    className='px-4 py-1 text-start w-full hover:bg-theme-700 round:rounded transition-colors'
                                    onClick={() => onClick(key as K)}
                                >
                                    {value}
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </>
    );
}
