import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import InlineLoadingSpinner from '../../InlineLoadingSpinner';

export interface GenericButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    loading?: boolean;
}

export function Generic({ loading = false, children, ...props }: GenericButtonProps) {
    if (loading) {
        props.disabled = true;
    }

    return (
        <button {...props} className={'relative round:rounded-lg disabled:brightness-75 disabled:pointer-events-none bg-linear-to-b px-3 min-h-[1.75rem]' + (props.className ? ' ' + props.className : '')}>
            <span className={loading ? 'opacity-0' : 'flex justify-center'}>{children}</span>
            {loading && <span className='absolute left-1/2 -translate-x-1/2'><InlineLoadingSpinner /></span>}
        </button>
    );
}
