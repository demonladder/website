import { forwardRef, DetailedHTMLProps, InputHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

export default forwardRef<HTMLTextAreaElement, Props>((props, ref) => (
    <textarea {...props} ref={ref} className='block bg-black bg-opacity-20 p-1 outline-none border-b-2 rounded-none resize-none h-32 w-full' />
));