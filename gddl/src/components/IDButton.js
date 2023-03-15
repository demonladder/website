import * as React from 'react';

export default function IDButton({ id, disabled = false, className }) {
    function onIDClick(e) {
        navigator.clipboard.writeText(''+id);

        e.target.classList.add('bg-fade');
        setTimeout(() => {
            e.target.classList.remove('bg-fade');
        }, 1000);
    }

    if (disabled) {
        return <p className={className}>{id}</p>;
    }

    return <button className={'underline ' + className} onClick={onIDClick} style={{ minWidth: '2rem' }}>{id}</button>;
}