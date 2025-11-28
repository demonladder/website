import { useEffect, useState } from 'react';

const CF_TURNSTILE_SITE_KEY = import.meta.env.VITE_CF_TURNSTILE_SITE_KEY;

declare const turnstile: {
    render: (containerID: string, options: {
        sitekey: string,
        theme?: 'auto' | 'light' | 'dark',
        size?: 'normal' | 'flexible' | 'compact',
        execution?: 'render' | 'execute',
        appearance?: 'always' | 'execute' | 'interaction-only',
        callback?: (token: string) => void,
        'error-callback'?: () => void,
    }) => string;
    getResponse: (widgetID: string) => string;
    isExpired: (widgetID: string) => boolean;
    reset: (widgetID: string) => void;
    remove: (widgetID: string) => void;
    execute: (containerID: string) => void;
};

export default function useTurnstile(containerID: string) {
    const [token, setToken] = useState<string>();
    const [status, setStatus] = useState<'ready' | 'pending' | 'error'>('pending');

    useEffect(() => {
        const widgetID = turnstile.render(`#${containerID}`, {
            sitekey: CF_TURNSTILE_SITE_KEY,
            theme: 'light',
            size: 'flexible',
            execution: 'execute',
            appearance: 'execute',
            callback: (token) => {
                setToken(token);
                setStatus('ready');
            },
            'error-callback': () => {
                setToken(undefined);
                setStatus('error');
            },
        });

        return () => {
            turnstile.remove(widgetID);
        };
    }, [containerID]);

    return {
        execute: async () => {
            turnstile.execute(`#${containerID}`);
            while (status === 'pending') {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }

            if (status === 'error') throw new Error('Turnstile challenge failed');
        },
        token,
    };
}
