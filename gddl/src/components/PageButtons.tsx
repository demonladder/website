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
    console.log(maxPages);
    

    return (
        <div className='mt-3 flex gap-3 justify-center items-center'>
            {meta.page > 0 &&  // If the current page is not the first, render button
            <div className='flex gap-2'>
                <PrimaryButton onClick={() => onPageChange(0)}>{'<<'}</PrimaryButton>
                <PrimaryButton onClick={() => onPageChange(meta.page-1)}>{'<'}</PrimaryButton>
            </div>
            }
            <div className='flex items-center gap-1'>
                <p className='m-0'>Page</p>
                <NumberInput disableSpinner={true} centered={true} value={meta.page+1} onChange={(e) => onPageChange(parseInt(e.target.value)-1 || 0)} style={{width: '3rem'}} />
                <p>/{maxPages}</p>
            </div>
            {meta.page <= maxPages-2 &&  // If the current page is not the last, render button
            <div className='flex gap-2'>
                <PrimaryButton onClick={() => onPageChange(meta.page+1)}>{'>'}</PrimaryButton>
                <PrimaryButton onClick={() => onPageChange(maxPages-1)}>{'>>'}</PrimaryButton>
            </div>
            }
        </div>
    );
}