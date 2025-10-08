import { GenericButtonProps, Generic } from './GenericButton';

export function PrimaryButton(props: GenericButtonProps) {
    const bgClass = props.disabled ? 'bg-button-primary-1/35 text-white/30' : 'bg-button-primary-1 hover:bg-button-primary-2 text-white';

    return (
        <Generic {...props} className={bgClass + (props.className ? ' ' + props.className : '')} />
    );
}
