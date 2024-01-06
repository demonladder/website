import { forwardRef } from 'react';
import { ICheckboxProps } from '../Input';

export default forwardRef<HTMLInputElement, ICheckboxProps>((props, ref) => {
    return (
        <input ref={ref} {...props} type='checkbox' className='appearance-none rounded-none w-4 h-4 border-[1px] border-current grid place-items-center before:w-3 before:h-3 before:bg-white before:scale-0 checked:before:scale-100 before:transition-transform disabled:text-gray-400' />
    );
});