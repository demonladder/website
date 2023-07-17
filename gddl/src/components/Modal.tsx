import React from 'react';

type Props = {
    title: string,
    show: boolean,
    children: React.ReactNode,
}

function Modal({ title, show, children }: Props) {
    return (
        <div className={'fixed z-30 top-0 w-full h-full transition-colors ' + (show ? 'bg-black bg-opacity-40 ' : 'pointer-events-none')}>
            <div className={'content max-w-lg absolute left-1/2 -translate-x-1/2 bg-gray-600 p-4 top-5 opacity-0 transition-opacity' + (show ? ' opacity-100 pointer-events-auto' : '')}>
                <div>
                    <h1 className='font-bold text-2xl'>{title}</h1>
                </div>
                {children}
            </div>
        </div>
    );
}

type ChildProps = {
    children: React.ReactNode,
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