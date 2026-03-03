import { GreaterThanEqual, LessThanEqual } from '@boxicons/react';

interface Props {
    label: string;
    min?: number;
    max?: number;
    onRemove: () => void;
}

export function RangeFilterLabel({ label, min, max, onRemove }: Props) {
    if (min === undefined && max === undefined) return;

    return (
        <button
            className='bg-theme-500 px-1 rounded-md border border-theme-400 hover:border-red-500 group slow-effect-transition flex gap-1'
            onClick={onRemove}
        >
            <span>{label}:</span>
            {min && max ? (
                `${min} - ${max}`
            ) : !min ? (
                <span className='flex items-center'>
                    <LessThanEqual size='xs' /> <span className='ms-0.5'>{max}</span>
                </span>
            ) : (
                <span className='flex items-center'>
                    <GreaterThanEqual size='xs' /> <span className='ms-0.5'>{min}</span>
                </span>
            )}{' '}
            <span className='mx-1 group-hover:text-red-500 slow-effect-transition font-bold'>X</span>
        </button>
    );
}
