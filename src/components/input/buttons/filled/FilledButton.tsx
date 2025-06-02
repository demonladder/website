import './filledButtonStyles.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: string | number;
    sizeVariant?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function FilledButton({ children, sizeVariant = 'sm', ...props }: Props) {
    return (
        <button {...props} className={`filled-button ${sizeVariant} ` + (props.className ?? '')}>{children}</button>
    );
}
