import { GenericButtonProps, Generic } from './GenericButton';

export function SecondaryButton(props: GenericButtonProps) {
    const bgClass = props.disabled ? 'bg-button-secondary-1/10 text-white/30' : 'bg-button-secondary-1 hover:bg-button-secondary-2';

    return (
        <Generic {...props} className={`${bgClass} text-on-secondary-container ${props.className ?? ''}`} />
    );
}
