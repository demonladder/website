import React from 'react';

type Props = {
    title: string,
    show: boolean,
    onHide: (e: any) => void,
    children: React.ReactNode,
}

export default function Modal({ title, show, onHide, children }: Props) {
    return (
        <div className={'cmodal' + (show ? ' show' : '')}>
            <div className='content'>
                <div className='header'>
                    <h1 className='title'>{title}</h1>
                    <button type='button' className='btn-close' onClick={onHide}></button>
                </div>
                {children}
            </div>
        </div>
    );
}

type ChildProps = {
    children: React.ReactNode,
}

export function Body({ children }: ChildProps) {
    return <div className='body'>
        {children}
    </div>;
}

export function Footer({ children }: ChildProps) {
    return <div className='footer'>
        {children}
    </div>;
}
