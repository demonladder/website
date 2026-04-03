import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import InlineLoadingSpinner from '../InlineLoadingSpinner';

export interface GenericButtonProps extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> {
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function Generic({ loading = false, size = 'sm', children, className, ...props }: GenericButtonProps) {
    if (loading) {
        props.disabled = true;
    }

    const sizeClass = (() => {
        switch (size) {
            default:
                return ' px-4';
            case 'md':
                return ' px-4 py-2 text-lg';
            case 'lg':
                return ' px-8 py-4 text-xl';
        }
    })();

    return (
        <button
            {...props}
            className={
                'text-center relative rounded-4xl active:rounded-xl disabled:pointer-events-none fast-spatial-transition px-3 min-h-7' +
                sizeClass +
                (className ? ' ' + className : '')
            }
        >
            <span className={'flex justify-center items-center ' + (loading ? 'opacity-0' : '')}>{children}</span>
            {loading && (
                <span className='absolute inset-0 grid place-items-center'>
                    <InlineLoadingSpinner />
                </span>
            )}
        </button>
    );
}
