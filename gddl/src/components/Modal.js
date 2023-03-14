import React from 'react';

export default function Modal({ title, show, onHide, children }) {
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

export function Body({ children }) {
    return <div className='body'>
        {children}
    </div>;
}

export function Footer({ children }) {
    return <div className='footer'>
        {children}
    </div>;
}
