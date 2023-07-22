import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

export function PrimaryButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button {...props} className={'bg-button-primary-1 hover:bg-button-primary-2 active:bg-button-primary-3 transition-colors px-2 h-7' + (props.className ? ' '+props.className : '')} />
    );
}

export function SecondaryButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button {...props} className='bg-button-secondary-1 hover:bg-button-secondary-2 active:bg-button-secondary-3 transition-colors px-2 h-7' />
    );
}

export function DangerButton(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button {...props} className={'bg-button-danger-1 hover:bg-button-danger-2 active:bg-button-danger-3 transition-colors px-2 h-7' + (props.className ? ' '+props.className : '')} />
    );
}