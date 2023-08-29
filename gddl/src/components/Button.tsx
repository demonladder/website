import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

function Generic(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button {...props} className={'round:rounded disabled:brightness-75 bg-gradient-to-b px-2 min-h-[1.75rem]' + (props.className ? ' '+props.className : '')} />
    );
}

export function PrimaryButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <Generic {...props} className={'text-white from-button-primary-1 to-button-primary-3 hover:to-button-primary-2 active:to-button-primary-1' + (props.className ? ' '+props.className : '')} />
    );
}

export function InfoButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <Generic {...props} className={'text-white from-button-info-1 to-button-info-3 hover:to-button-info-2 active:to-button-info-1' + (props.className ? ' '+props.className : '')} />
    );
}

export function SecondaryButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <Generic {...props} className={'from-button-secondary-1 to-button-secondary-3 hover:to-button-secondary-2 active:to-button-secondary-1' + (props.className ? ' '+props.className : '')} />
    );
}

export function DangerButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <Generic {...props} className={'text-white from-button-danger-1 to-button-danger-3 hover:to-button-danger-2 active:to-button-danger-1' + (props.className ? ' '+props.className : '')} />
    );
}