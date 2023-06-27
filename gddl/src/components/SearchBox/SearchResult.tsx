import React from 'react';

type Props = {
    msg: string,
    onClick: (e: any) => void,
}

export default function SearchResult({ msg, onClick }: Props) {
    return (
        <div className='resultItem'>
            <p className='m-0' onClick={onClick}>{msg}</p>
        </div>
    );
}