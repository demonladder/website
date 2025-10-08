import { toast } from 'react-toastify';

interface Props {
    id: number,
    disabled?: boolean,
    className?: string,
    style?: React.CSSProperties,
}

export default function IDButton({ id, disabled = false, className, style }: Props) {
    function onIDClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        void navigator.clipboard.writeText('' + id);
        toast.success('Copied to clipboard');

        (e.target as HTMLButtonElement).classList.remove('bg-fade');
        setTimeout(() => {
            (e.target as HTMLButtonElement).classList.add('bg-fade');
        }, 10);
    }

    if (disabled) {
        return <p className={className}>{id}</p>;
    }

    return <button className={'underline' + (className ? ' ' + className : '')} onClick={onIDClick} style={{ minWidth: '2rem' }}><span style={style}>{id}</span></button>;
}
