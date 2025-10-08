import { GenericButtonProps, Generic } from './GenericButton';

export function DangerButton({ ...props }: GenericButtonProps) {
    return (
        <Generic {...props} className={'text-white bg-button-danger-2 hover:bg-button-danger-1' + (props.className ? ' ' + props.className : '')} />
    );
}
