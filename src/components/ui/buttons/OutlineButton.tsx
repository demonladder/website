import { GenericButtonProps, Generic } from './GenericButton';

export function OutlineButton(props: GenericButtonProps) {
    return (
        <Generic {...props} className={'border-2 border-current hover:bg-button-secondary-3' + (props.className ? ' ' + props.className : '')} />
    );
}
