import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    variant: '900' | '800' | '700' | '600' | '500';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Surface({ variant, size = 'md', className, ...props }: Props) {
    let classNames = {
        '900': 'bg-theme-900',
        '800': 'bg-theme-800',
        '700': 'bg-theme-700',
        '600': 'bg-theme-600',
        '500': 'bg-theme-500',
    }[variant];

    classNames += ' ' + {
        'sm': 'shadow-sm p-2 round:rounded',
        'md': 'shadow px-4 py-2 round:rounded-lg',
        'lg': 'shadow-lg px-6 py-4 round:rounded-xl',
        'xl': 'shadow-xl px-8 py-6 round:rounded-2xl',
    }[size];

    classNames += ' border border-theme-outline';

    if (className) classNames += ' ' + className;

    return (
        <div {...props} className={classNames} />
    );
}
