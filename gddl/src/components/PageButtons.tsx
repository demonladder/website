import { clamp } from "../utils/clamp";
import { PrimaryButton } from "./Button";
import { NumberInput } from "./Input";

type Props = {
    onPageChange: (page: number) => void,
    meta?: PageMeta,
}

export type PageMeta = {
    page: number,
    total: number,
    limit: number,
}

// meta.page starts at 0
export default function PageButtons({ onPageChange, meta }: Props) {
    if (meta === undefined) return;

    if (meta.total <= meta.limit) return; // If there is only a single page, return nothing

    const maxPages = Math.ceil(meta.total / meta.limit);

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const parsed = parseInt(e.target.value);
        if (isNaN(parsed)) return;

        onPageChange(clamp(parsed, 1, maxPages));
    }

    return (
        <div className='mt-3 flex gap-3 justify-center items-center'>
            {meta.page > 1 &&  // If the current page is not the first, render button
            <div className='flex gap-2'>
                <PrimaryButton onClick={() => onPageChange(1)}>{'<<'}</PrimaryButton>
                <PrimaryButton onClick={() => onPageChange(meta.page-1)}>{'<'}</PrimaryButton>
            </div>
            }
            <div className='flex items-center gap-1'>
                <p className='m-0'>Page</p>
                <NumberInput disableSpinner={true} centered={true} value={meta.page} onChange={onChange} style={{width: '3rem'}} />
                <p>/{maxPages}</p>
            </div>
            {meta.page < maxPages &&  // If the current page is not the last, render button
            <div className='flex gap-2'>
                <PrimaryButton onClick={() => onPageChange(meta.page+1)}>{'>'}</PrimaryButton>
                <PrimaryButton onClick={() => onPageChange(maxPages)}>{'>>'}</PrimaryButton>
            </div>
            }
        </div>
    );
}