import { GenericButtonProps, Generic } from './GenericButton';

export function OutlineButton(props: GenericButtonProps) {
    return (
        <Generic {...props} className={'border-2 border-button-secondary-2 hover:bg-button-secondary-3 text-white' + (props.className ? ' ' + props.className : '')} />
    );
}
