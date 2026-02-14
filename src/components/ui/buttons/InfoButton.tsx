import { GenericButtonProps, Generic } from './GenericButton';

export function InfoButton(props: GenericButtonProps) {
    return (
        <Generic
            {...props}
            className={
                'text-white from-button-info-1 to-button-info-3 hover:to-button-info-2 active:to-button-info-1' +
                (props.className ? ' ' + props.className : '')
            }
        />
    );
}
