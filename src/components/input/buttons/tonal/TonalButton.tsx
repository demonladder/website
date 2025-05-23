import './tonalButton.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: string | number;
}

export default function TonalButton({ children, ...props }: Props) {
    return (
        <button {...props} className={'tonal-button ' + (props.className ?? '')}>{children}</button>
    );
}
