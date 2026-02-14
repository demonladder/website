import { GenericButtonProps, Generic } from './GenericButton';

export function OutlineButton(props: GenericButtonProps) {
    return (
        <Generic
            {...props}
            className={
                'outline-2 outline-current hover:bg-button-secondary-3' + (props.className ? ' ' + props.className : '')
            }
        />
    );
}
