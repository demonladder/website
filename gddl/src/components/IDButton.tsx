interface Props {
    id: number,
    disabled?: boolean,
    className?: string,
}

export default function IDButton({ id, disabled = false, className }: Props) {
    function onIDClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        navigator.clipboard.writeText('' + id);

        (e.target as HTMLButtonElement).classList.remove('bg-fade');
        setTimeout(() => {
            (e.target as HTMLButtonElement).classList.add('bg-fade');
        }, 10);
    }

    if (disabled) {
        return <p className={className}>{id}</p>;
    }

    return <button className={'underline' + (className ? ' ' + className : '')} onClick={onIDClick} style={{ minWidth: '2rem' }}>{id}</button>;
}