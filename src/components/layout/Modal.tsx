import React, { useRef } from 'react';
import { Heading1 } from '../headings';

interface Props {
    title: string;
    show: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

export default function Modal({ title, show, children, onClose }: Props) {
    const backgroundRef = useRef(null);

    function handleClose(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === backgroundRef.current) {
            onClose();
        }
    }

    return (
        <div
            ref={backgroundRef}
            onClick={handleClose}
            className={
                'fixed z-40 inset-0 w-full h-full transition-colors ' + (show ? 'bg-black/40 ' : 'pointer-events-none')
            }
        >
            <div
                style={{ maxHeight: 'calc(100% - 10rem)' }}
                className={
                    'max-w-lg min-w-[314px] overflow-y-auto top-5 absolute left-1/2 -translate-x-1/2 round:rounded-xl bg-theme-600 text-theme-text px-6 py-4 opacity-0 transition-opacity text-base' +
                    (show ? ' opacity-100 pointer-events-auto' : '')
                }
            >
                <div>
                    <Heading1>{title}</Heading1>
                </div>
                {children}
            </div>
        </div>
    );
}
