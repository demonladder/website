import { XIcon } from '../../shared/icons';
import './search.css';

interface Props extends Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'type'
> {
    onMenu?: (e: React.MouseEvent) => void;
    onClear?: () => void;
}

export default function Search({ onMenu, placeholder, value, onClear, ...props }: Props) {
    return (
        <div className='relative search'>
            {onMenu && <i className='bx bx-filter text-2xl cursor-pointer' onClick={onMenu} />}
            <input type='text' value={value} {...props} placeholder={placeholder ?? 'Search...'} />
            {value !== '' && (
                <button className='absolute right-3 ' onClick={onClear}>
                    <XIcon size={40} />
                </button>
            )}
        </div>
    );
}
