import { useEffect, useRef } from 'react';
import { clamp } from '../../utils/clamp';

interface ParentNode {
    children: React.ReactNode;
}

interface Props extends ParentNode {
    label: React.ReactNode;
}

export default function Tooltip({ children, label }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current || !childrenRef.current) return;

        const rect = ref.current.getBoundingClientRect();
        const childrenRect = childrenRef.current.getBoundingClientRect();

        const targetDx = childrenRect.width / 2 - rect.width / 2;
        const targetX = childrenRect.x + targetDx;
        const clampedX = clamp(targetX, 0, window.outerWidth - rect.width);

        ref.current.style.left = `${clampedX}px`;
    }, [label]);

    return (
        <div className='group'>
            <div ref={childrenRef}>{children}</div>
            <div
                ref={ref}
                className='absolute opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50'
            >
                <svg width='20' height='10' className='mx-auto' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M0 10 L10 0 L20 10 Z' style={{ fill: 'var(--color-theme-500)' }} />
                </svg>
                <div className='bg-theme-500 text-theme-text px-2 py-1 round:rounded-md shadow-lg w-72 text-base'>
                    {label}
                </div>
            </div>
        </div>
    );
}
