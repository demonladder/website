import { DetailedHTMLProps, AnchorHTMLAttributes } from 'react';

export function DiscordLink(props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) {
    return (
        <a {...props} href='/api/oauth/2/discord' style={{ borderRadius: '3px', padding: '7px 16px' }} className={'w-full text-center text-white bg-button-discord-primary hover:bg-button-discord-hover active:bg-button-discord-active transition-colors inline-block my-1' + (props.className ? ' ' + props.className : '')} />
    );
}
