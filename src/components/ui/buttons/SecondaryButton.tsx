import { GenericButtonProps, Generic } from './GenericButton';

export function SecondaryButton(props: GenericButtonProps) {
    return (
        <Generic {...props} className={'from-button-secondary-1 to-button-secondary-3 hover:to-button-secondary-2 active:to-button-secondary-1 text-white' + (props.className ? ' ' + props.className : '')} />
    );
}
