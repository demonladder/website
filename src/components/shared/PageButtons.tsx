import { useEffect, useState } from 'react';
import { clamp } from '../../utils/clamp';
import { PrimaryButton } from '../ui/buttons/PrimaryButton';
import { NumberInput } from './input/Input';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from '@boxicons/react';

interface Props {
    onPageChange: (page: number) => void;
    page: number;
    total: number;
    limit: number;
}

export default function PageButtons({ onPageChange, page, total, limit }: Props) {
    const [pageInput, setPageInput] = useState((page + 1).toString());

    useEffect(() => {
        setPageInput((page + 1).toString());
    }, [page]);

    if (total <= limit) return; // If there is only a single page, return nothing

    const maxPages = Math.ceil(total / limit);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPageInput(e.target.value);
        console.log(e.target.value);
        if (e.target.value === '') return;

        const parsed = parseInt(e.target.value);
        if (isNaN(parsed)) return;

        onPageChange(clamp(parsed - 1, 0, maxPages - 1));
    }

    function onPageButtonClick(page: number) {
        onPageChange(page);
        setPageInput((page + 1).toString());
    }

    return (
        <div className='mt-3 flex gap-3 justify-center items-center'>
            <div className={'flex gap-2 text-2xl' + (page === 0 ? ' opacity-0 pointer-events-none' : '')}>
                <PrimaryButton onClick={() => onPageButtonClick(0)}>
                    <ChevronsLeft />
                </PrimaryButton>
                <PrimaryButton onClick={() => onPageButtonClick(page - 1)}>
                    <ChevronLeft />
                </PrimaryButton>
            </div>
            <div className='flex items-center gap-1'>
                <p className='m-0'>Page</p>
                <NumberInput
                    disableSpinner={true}
                    centered={true}
                    value={pageInput}
                    onChange={onChange}
                    style={{ width: '3.25rem' }}
                />
                <p>/{maxPages}</p>
            </div>
            <div className={'flex gap-2 text-2xl' + (page + 1 < maxPages ? '' : ' opacity-0 pointer-events-none')}>
                <PrimaryButton onClick={() => onPageButtonClick(page + 1)}>
                    <ChevronRight />
                </PrimaryButton>
                <PrimaryButton onClick={() => onPageButtonClick(maxPages - 1)}>
                    <ChevronsRight />
                </PrimaryButton>
            </div>
        </div>
    );
}
