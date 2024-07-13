import { useCallback } from 'react';
import { toast } from 'react-toastify';

export default function Copy({ text }: { text: string }) {
    const click = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();

        navigator.clipboard.writeText(text);
        toast.success('Copied level ID');
    }, [text]);

    return (
        <i className='bx bx-clipboard hover:-translate-y-[2px] transition-transform' onClick={(e) => click(e)} />
    );
}