import { useCallback } from 'react';
import { toast } from 'react-toastify';

export default function Copy({ text }: { text: string }) {
    const click = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            e.preventDefault();

            void navigator.clipboard.writeText(text);
            toast.success('Copied level ID');
        },
        [text],
    );

    return (
        <i
            className='bx bx-clipboard hover:-translate-y-0.5 cursor-pointer transition-transform'
            onClick={(e) => click(e)}
        />
    );
}
