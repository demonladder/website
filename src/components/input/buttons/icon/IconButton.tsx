import './iconButton.css';

interface Props extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'className' | 'children'> {
    children: React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'filled' | 'tonal' | 'outline' | 'standard';
    width?: 'thin' | 'standard' | 'wide';
    disabled?: boolean;
    isSelected?: boolean;
}

export default function IconButton({ size = 'md', color = 'standard', width = 'standard', disabled = false, isSelected = false, ...props }: Props) {
    let classNames = 'icon-button ';
    classNames += {
        filled: 'filled',
        tonal: 'tonal',
        outline: 'outlined',
        standard: '',
    }[color];

    classNames += ' ' + size;
    classNames += ' ' + width;

    if (disabled) classNames += ' disabled';
    if (isSelected) classNames += ' selected';

    return (
        <button {...props} className={classNames} />
    );
}
