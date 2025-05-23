import './filledButtonStyles.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: string | number;
}

export default function FilledButton({ children, ...props }: Props) {
    return (
        <button {...props} className={'filled-button ' + (props.className ?? '')}>{children}</button>
    );
}
