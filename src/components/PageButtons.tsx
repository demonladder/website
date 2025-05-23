import { useState } from 'react';
import { clamp } from '../utils/clamp';
import { PrimaryButton } from './ui/buttons/PrimaryButton';
import { NumberInput } from './Input';

interface Props {
    onPageChange: (page: number) => void;
    meta?: PageMeta;
}

export interface PageMeta {
    page: number;
    total: number;
    limit: number;
}

export default function PageButtons({ onPageChange, meta }: Props) {
    const [page, setPage] = useState(((meta?.page ?? 0) + 1).toString());

    if (meta === undefined) return;

    if (meta.total <= meta.limit) return; // If there is only a single page, return nothing

    const maxPages = Math.ceil(meta.total / meta.limit);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPage(e.target.value);
        if (e.target.value === '') return;

        const parsed = parseInt(e.target.value);
        if (isNaN(parsed)) return;

        onPageChange(clamp(parsed - 1, 1, maxPages));
    }

    function onPageButtonClick(page: number) {
        onPageChange(page);
        setPage((page + 1).toString());
    }

    return (
        <div className='mt-3 flex gap-3 justify-center items-center'>
            {meta.page > 0 &&  // If the current page is not the first, render button
                <div className='flex gap-2 text-2xl'>
                    <PrimaryButton onClick={() => onPageButtonClick(0)}><i className='bx bx-chevrons-left' /></PrimaryButton>
                    <PrimaryButton onClick={() => onPageButtonClick(meta.page - 1)}><i className='bx bx-chevron-left' /></PrimaryButton>
                </div>
            }
            <div className='flex items-center gap-1'>
                <p className='m-0'>Page</p>
                <NumberInput disableSpinner={true} centered={true} value={page} onChange={onChange} style={{ width: '3rem' }} />
                <p>/{maxPages}</p>
            </div>
            {(meta.page + 1) < maxPages &&  // If the current page is not the last, render button
                <div className='flex gap-2 text-2xl'>
                    <PrimaryButton onClick={() => onPageButtonClick(meta.page + 1)}><i className='bx bx-chevron-right' /></PrimaryButton>
                    <PrimaryButton onClick={() => onPageButtonClick(maxPages - 1)}><i className='bx bx-chevrons-right' /></PrimaryButton>
                </div>
            }
        </div>
    );
}
