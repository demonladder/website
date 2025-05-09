import { GenericButtonProps, Generic } from './GenericButton';

export function PrimaryButton(props: GenericButtonProps) {
    return (
        <Generic {...props} style={{ color: 'white' }} className={'from-button-primary-1 to-button-primary-3 not-disabled:hover:to-button-primary-2 not-disabled:active:to-button-primary-1' + (props.className ? ' ' + props.className : '')} />
    );
}
