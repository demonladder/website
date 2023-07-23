import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from 'react';

export const TextInput = forwardRef<HTMLInputElement, DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>((props, ref) => (
    <input {...props} ref={ref} type='text' className='outline-none rounded-none caret-current border-b-2 border-current bg-black bg-opacity-20 placeholder-current placeholder:opacity-50 ps-2 w-full h-7' />
));

export const PasswordInput = forwardRef<HTMLInputElement, DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>>((props, ref) => (
    <input {...props} ref={ref} type='password' className='outline-none rounded-none caret-current border-b-2 border-current bg-black bg-opacity-20 placeholder-current placeholder:opacity-50 ps-2 w-full h-7' />
));

interface INumberInput extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    disableSpinner?: boolean,
    centered?: boolean,
}

export function NumberInput({ disableSpinner, centered, ...props}: INumberInput) {
    return (
        <input {...props} type='number' className={'outline-none rounded-none caret-current border-b-2 border-current bg-black bg-opacity-20 placeholder-current placeholder:opacity-50 ps-2 w-full h-7' + (disableSpinner ? ' no-spinner' : '') + (centered ? ' text-center pe-2' : '')} />
    );
}

export function CheckBox(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
    return (
        <input {...props} type='checkbox' className='appearance-none rounded-none w-4 h-4 border-[1px] border-current grid place-items-center before:w-3 before:h-3 before:bg-white before:scale-0 checked:before:scale-100 before:transition-transform' />
    );
}

export function RadioButton(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
    return (
        <input {...props} type='radio' className='appearance-none rounded-none w-4 h-4 border-[1px] border-current grid place-items-center before:w-3 before:h-3 before:bg-white before:scale-0 checked:before:scale-100 before:transition-transform' />
    );
}