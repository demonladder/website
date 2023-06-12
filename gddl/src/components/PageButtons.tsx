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
    if (meta.nextPage === 1) return <></>;  // If there is only a single page, return nothing

    return (
        <div className='mt-3 d-flex gap-3 justify-content-center align-items-center'>
            {page !== meta.previousPage &&  // If the current page is not the first, render button
                <button className='primary' onClick={() => onPageChange(meta.previousPage)}>Previous</button>
            }
            <p className='m-0'>Page {page}/{meta.pages}</p>
            {loadingState === 'fetching' && <LoadingSpinner />}
            {page !== meta.nextPage &&  // If the current page is not the last, render button
                <button className='primary' onClick={() => onPageChange(meta.nextPage)}>Next</button>
            }
        </div>
    );
}