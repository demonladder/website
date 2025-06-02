import './textButtonStyles.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: string | number;
}

export default function TextButton({ children, ...props }: Props) {
    return (
        <button {...props} className={'text-button ' + (props.className ?? '')}>{children}</button>
    );
}
