import React from 'react';
import LoadingSpinner from './LoadingSpinner';

type Props = {
    onPageChange: (page: number) => void,
    page: number,
    meta: PageMeta,
    loadingState?: any,
}

export type PageMeta = {
    pages: number,
    previousPage: number,
    nextPage: number,
}

export default function PageButtons({ onPageChange, page, meta, loadingState }: Props) {
    if (meta.nextPage === 1) return <></>;  // If there is only a single page, return nothing

    return (
        <div className='mt-3 d-flex gap-3 justify-content-center align-items-center'>
            {page !== meta.previousPage &&  // If the current page is not the first, render button
            <div className='d-flex gap-2'>
                <button className='primary' onClick={() => onPageChange(1)}>{'<<'}</button>
                <button className='primary px-2' onClick={() => onPageChange(meta.previousPage)}>{'<'}</button>
            </div>
            }
            <div className='d-flex align-items-center gap-1'>
                <p className='m-0'>Page</p>
                <input type='number' value={page} onChange={(e) => onPageChange(parseInt(e.target.value) || 1)} style={{width: '2.2rem'}} />
                <p>/{meta.pages}</p>
            </div>
            {loadingState === 'fetching' && <LoadingSpinner />}
            {page !== meta.nextPage &&  // If the current page is not the last, render button
            <div className='d-flex gap-2'>
                <button className='primary px-2' onClick={() => onPageChange(meta.nextPage)}>{'>'}</button>
                <button className='primary' onClick={() => onPageChange(meta.pages)}>{'>>'}</button>
            </div>
            }
        </div>
    );
}