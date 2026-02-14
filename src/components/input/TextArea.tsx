import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    invalid?: boolean;
}

export default function TextArea({ invalid, ...props }: Props) {
    return (
        <textarea
            {...props}
            className={
                'block bg-theme-950/70 p-1 outline-none border-b-2 rounded-none resize-none h-32 w-full' +
                (invalid ? ' border-red-600' : '')
            }
        />
    );
}
