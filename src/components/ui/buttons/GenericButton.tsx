import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import InlineLoadingSpinner from '../../InlineLoadingSpinner';

export interface GenericButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function Generic({ loading = false, size = 'sm', children, className, ...props }: GenericButtonProps) {
    if (loading) {
        props.disabled = true;
    }

    const sizeClass = (() => {
        switch (size) {
            default: return '';
            case 'md': return ' px-4 py-2 text-lg';
            case 'lg': return ' px-8 py-4 text-xl';
        }
    })();

    return (
        <button {...props} className={'text-center relative rounded-4xl active:rounded-xl disabled:pointer-events-none fast-spatial-transition px-3 min-h-[1.75rem]' + sizeClass + (className ? ' ' + className : '')}>
            <span className={loading ? 'opacity-0' : ''}>{children}</span>
            {loading && <span className='absolute left-1/2 -translate-x-1/2'><InlineLoadingSpinner /></span>}
        </button>
    );
}
