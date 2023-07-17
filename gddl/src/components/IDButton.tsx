type Props = {
    id: number,
    disabled?: boolean,
    className?: string,
}

export default function IDButton({ id, disabled = false, className }: Props) {
    function onIDClick(e: any) {
        navigator.clipboard.writeText(''+id);

        e.target.classList.remove('bg-fade');
        setTimeout(() => {
            e.target.classList.add('bg-fade');
        }, 10);
    }

    if (disabled) {
        return <p className={className}>{id}</p>;
    }

    return <button className={'underline ' + className} onClick={onIDClick} style={{ minWidth: '2rem' }}>{id}</button>;
}