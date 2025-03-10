import { AnchorHTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import InlineLoadingSpinner from './InlineLoadingSpinner';

interface GenericButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    loading?: boolean;
}

function Generic({ loading = false, children, ...props}: GenericButtonProps) {
    if (loading) {
        props.disabled = true;
    }

    return (
        <button {...props} className={'relative round:rounded disabled:brightness-75 bg-linear-to-b px-3 min-h-[1.75rem]' + (props.className ? ' '+props.className : '')}>
            <span className={loading ? 'opacity-0' : ''}>{children}</span>
            {loading && <span className='absolute left-1/2 -translate-x-1/2'><InlineLoadingSpinner /></span>}
        </button>
    );
}

export function PrimaryButton(props: GenericButtonProps) {
    return (
        <Generic {...props} className={'text-white from-button-primary-1 to-button-primary-3 hover:to-button-primary-2 active:to-button-primary-1' + (props.className ? ' '+props.className : '')} />
    );
}

export function InfoButton(props: GenericButtonProps) {
    return (
        <Generic {...props} className={'text-white from-button-info-1 to-button-info-3 hover:to-button-info-2 active:to-button-info-1' + (props.className ? ' '+props.className : '')} />
    );
}

export function SecondaryButton(props: GenericButtonProps) {
    return (
        <Generic {...props} className={'from-button-secondary-1 to-button-secondary-3 hover:to-button-secondary-2 active:to-button-secondary-1' + (props.className ? ' '+props.className : '')} />
    );
}

export function DangerButton(props: GenericButtonProps) {
    return (
        <Generic {...props} className={'text-white from-button-danger-1 to-button-danger-3 hover:to-button-danger-2 active:to-button-danger-1' + (props.className ? ' '+props.className : '')} />
    );
}

export function DiscordButton(props: GenericButtonProps) {
    return (
        <button {...props} style={{ borderRadius: '3px', padding: '7px 16px' }} className={'text-white bg-button-discord-primary hover:bg-button-discord-hover active:bg-button-discord-active transition-colors' + (props.className ? ' '+props.className : '')} />
    );
}

export function DiscordLink(props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
    return (
        <a {...props} style={{ borderRadius: '3px', padding: '7px 16px' }} className={'text-white bg-button-discord-primary hover:bg-button-discord-hover active:bg-button-discord-active transition-colors inline-block my-1' + (props.className ? ' '+props.className : '')} />
    );
}
