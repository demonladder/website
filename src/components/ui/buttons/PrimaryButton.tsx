import { GenericButtonProps, Generic } from './GenericButton';

export function PrimaryButton(props: GenericButtonProps) {
    return (
        <Generic {...props} className={'text-white from-button-primary-1 to-button-primary-3 hover:to-button-primary-2 active:to-button-primary-1' + (props.className ? ' ' + props.className : '')} />
    );
}
