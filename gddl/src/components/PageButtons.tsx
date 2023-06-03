import React from 'react';
import LoadingSpinner from './LoadingSpinner';

type Props = {
    onPageChange: (page: number) => void,
    page: number,
    meta: {
        pages: number,
        previousPage: number,
        nextPage: number,
    },
    loadingState?: any,
}

export default function PageButtons({ onPageChange, page, meta, loadingState }: Props) {
    return (
        <div className='mt-3 d-flex gap-3 justify-content-center'>
            <button className='primary' onClick={() => onPageChange(meta.previousPage)}>Previous</button>
            <span>Page {page}/{meta.pages}</span>
            {loadingState === 'fetching' && <LoadingSpinner />}
            <button className='primary' onClick={() => onPageChange(meta.nextPage)}>Next</button>
        </div>
    );
}