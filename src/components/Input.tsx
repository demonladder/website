import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    invalid?: boolean;
}

function Input({ ref, invalid = false, ...props }: InputProps) {
    return <input {...props} ref={ref} className={'outline-none rounded-none caret-current border-b-2 border-current bg-theme-950/70 placeholder-current placeholder:opacity-50 ps-2 w-full h-7' + (invalid ? ' border-red-600' : '')} />;
}

export function TextInput(props: Omit<InputProps, 'type'>) {
    return <Input {...props} type='text' />;
}

export function URLInput(props: Omit<InputProps, 'type'>) {
    return <Input {...props} type='url' />;
}

export function PasswordInput(props: Omit<InputProps, 'type'>) {
    return <Input {...props} type='password' />;
}

interface INumberInput extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    disableSpinner?: boolean,
    centered?: boolean,
    invalid?: boolean,
}

export const NumberInput = forwardRef<HTMLInputElement, INumberInput>(({ disableSpinner, centered, invalid = false, ...props }, ref) => (
    <input {...props} ref={ref} type='number' className={'outline-none rounded-none caret-current border-b-2 border-current bg-theme-950/70 placeholder-current placeholder:opacity-50 ps-2 w-full h-7' + (disableSpinner ? ' no-spinner' : '') + (centered ? ' text-center pe-2' : '') + (invalid ? ' border-red-600' : '')} />
));

export function RadioButton(props: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
    return (
        <input {...props} type='radio' className='appearance-none rounded-none w-4 h-4 border-[1px] border-current grid place-items-center before:w-3 before:h-3 before:bg-white before:scale-0 checked:before:scale-100 before:transition-transform' />
    );
}
