interface Props {
    children: React.ReactNode;
    label: string | React.ReactNode;
}

export default function Tooltip({ children, label }: Props) {
    return (
        <div className='relative group'>
            {children}
            <div className='absolute bottom-0 translate-y-full left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50'>
                <svg width='20' height='10' className='mx-auto' xmlns='http://www.w3.org/2000/svg'>
                    <path  d='M0 10 L10 0 L20 10 Z' style={{ fill: 'var(--color-theme-500)' }} />
                </svg>
                <div className='bg-theme-500 text-white px-2 py-1 rounded-md shadow-lg whitespace-nowrap text-base'>
                    {label}
                </div>
            </div>
        </div>
    );
}
