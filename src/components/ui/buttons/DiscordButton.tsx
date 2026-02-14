import { GenericButtonProps } from './GenericButton';

export function DiscordButton(props: GenericButtonProps) {
    return (
        <button
            {...props}
            style={{ borderRadius: '3px', padding: '7px 16px' }}
            className={
                'text-white bg-button-discord-primary hover:bg-button-discord-hover active:bg-button-discord-active transition-colors' +
                (props.className ? ' ' + props.className : '')
            }
        />
    );
}
