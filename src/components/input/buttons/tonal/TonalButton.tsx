import './tonalButton.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: string | number | React.ReactNode;
    icon?: React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    isSelected?: boolean;
}

export default function TonalButton({ children, size = 'md', icon, isSelected = false, ...props }: Props) {
    let classNames = 'tonal-button ';
    classNames += size;

    if (isSelected) classNames += ' selected';

    return (
        <button {...props} className={classNames}>{icon && <span className='icon'>{icon}</span>} {children}</button>
    );
}
