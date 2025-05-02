import { forwardRef, DetailedHTMLProps, InputHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

export default forwardRef<HTMLTextAreaElement, Props & { invalid?: boolean }>(({ invalid, ...props }, ref) => (
    <textarea {...props} ref={ref} className={'block bg-theme-950/70 p-1 outline-none border-b-2 rounded-none resize-none h-32 w-full' + (invalid ? ' border-red-600' : '')} />
));
