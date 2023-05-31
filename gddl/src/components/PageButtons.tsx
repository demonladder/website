import React from 'react';
import LoadingSpinner from './LoadingSpinner';

type Props = {
    onPageChange: (page: number) => void,
    page: number,
    next: number,
    prev: number,
    loadingState?: any,
}

export default function PageButtons({ onPageChange, page, next, prev, loadingState }: Props) {
    console.log(loadingState);
    
    return (
        <div className='mt-3 d-flex gap-3 justify-content-center'>
            <button className='primary' onClick={() => onPageChange(prev)}>Previous</button>
            <span>Page {page}</span>
            {loadingState === 'fetching' && <LoadingSpinner />}
            <button className='primary' onClick={() => onPageChange(next)}>Next</button>
        </div>
    );
}