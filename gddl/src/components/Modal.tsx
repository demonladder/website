import React, { useRef } from 'react';

type Props = {
    title: string,
    show: boolean,
    children: React.ReactNode,
    onClose: () => void,
}

function Modal({ title, show, children, onClose }: Props) {
    const wrapperRef = useRef(null);

    function handleClose(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === wrapperRef.current) {
            onClose();
        }
    }

    return (
        <div ref={wrapperRef} onClick={(e) => handleClose(e)} className={'fixed z-30 inset-0 w-full h-full transition-colors ' + (show ? 'bg-black bg-opacity-40 ' : 'pointer-events-none')}>
            <div className={'max-w-lg min-w-[314px] absolute left-1/2 -translate-x-1/2 bg-gray-600 text-white p-4 top-5 opacity-0 transition-opacity' + (show ? ' opacity-100 pointer-events-auto' : '')}>
                <div>
                    <h1 className='font-bold text-2xl'>{title}</h1>
                </div>
                {children}
            </div>
        </div>
    );
}

type ChildProps = {
    children?: React.ReactNode,
}

function Body({ children }: ChildProps) {
    return <div className='my-3'>
        {children}
    </div>;
}

function Footer({ children }: ChildProps) {
    return <div className='footer'>
        {children}
    </div>;
}

export default Object.assign(Modal, {
    Body,
    Footer,
});