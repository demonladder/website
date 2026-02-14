import { KeyboardAccessibility } from '../../utils/KeyboardAccessibility';

interface Props {
    msg: string;
    onClick: () => void;
}

export default function SearchResult({ msg, onClick }: Props) {
    return (
        <div
            className='px-4 py-1 hover:bg-theme-700 round:rounded-lg transition-colors cursor-pointer'
            tabIndex={0}
            onKeyDown={KeyboardAccessibility.onSelect(onClick)}
            onClick={onClick}
        >
            <p className='m-0'>{msg}</p>
        </div>
    );
}
