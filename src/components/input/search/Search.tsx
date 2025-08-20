import './search.css';

interface Props extends Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'type'> {
    onMenu?: (e: React.MouseEvent) => void;
}

export default function Search({ onMenu, placeholder, ...props }: Props) {
    return (
        <div className='search'>
            <i className='bx bx-filter text-2xl cursor-pointer' onClick={onMenu} />
            <input type='text' {...props} placeholder={placeholder ?? 'Search...'} />
        </div>
    );
}
