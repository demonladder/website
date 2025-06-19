import { forwardRef } from 'react';
import './search.css';

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onMenu?: (e: React.MouseEvent) => void;
}

const Search = forwardRef<HTMLInputElement, Props>(function Search({ onMenu, placeholder, ...props }: Props, ref) {
    return (
        <div className='search'>
            <i className='bx bx-filter text-2xl cursor-pointer' onClick={onMenu} />
            <input type='text' {...props} ref={ref} placeholder={placeholder ?? 'Search...'} />
        </div>
    );
});
export default Search;
