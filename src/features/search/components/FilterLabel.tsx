interface Props {
    label: string;
    onRemove: () => void;
}

export function FilterLabel({ label, onRemove }: Props) {
    return (
        <button
            className='bg-theme-500 px-1 mx-1 round:rounded-md border border-theme-400 hover:border-red-500 group slow-effect-transition'
            onClick={onRemove}
        >
            {label} <span className='mx-1 group-hover:text-red-500 slow-effect-transition font-bold'>X</span>
        </button>
    );
}
