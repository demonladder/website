import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

type ICheckboxProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export default function Checkbox(props: ICheckboxProps) {
    return (
        <input {...props} type='checkbox' className='appearance-none cursor-pointer rounded-none w-4 h-4 border-[1px] border-current grid place-items-center before:w-3 before:h-3 before:bg-theme-text before:scale-0 checked:before:scale-100 before:transition-transform disabled:text-gray-400' />
    );
}
