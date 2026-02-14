import { GenericButtonProps, Generic } from './GenericButton';

interface Props extends GenericButtonProps {
    isPressedOverride?: boolean;
}

export function SecondaryButton({ isPressedOverride = false, ...props }: Props) {
    const bgClass = props.disabled
        ? 'bg-button-secondary-1/10 text-white/30'
        : 'bg-button-secondary-1 hover:bg-button-secondary-2';

    return (
        <Generic
            {...props}
            className={`${bgClass} text-on-secondary-container ${isPressedOverride ? 'rounded-lg' : ''} ${props.className ?? ''}`}
        />
    );
}
