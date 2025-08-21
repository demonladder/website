import './textButtonStyles.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: string | number;
    outline?: boolean;
}

export default function TextButton({ children, outline, ...props }: Props) {
    return (
        <button {...props} className={'text-button ' + (props.className ?? '') + (outline ? ' outlined' : '')}>{children}</button>
    );
}
