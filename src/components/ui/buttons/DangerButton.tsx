import { GenericButtonProps, Generic } from './GenericButton';

export function DangerButton(props: GenericButtonProps) {
    return (
        <Generic {...props} className={'text-white from-button-danger-1 to-button-danger-3 hover:to-button-danger-2 active:to-button-danger-1' + (props.className ? ' ' + props.className : '')} />
    );
}
