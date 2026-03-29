import { useEffect, useRef, useState } from 'react';

const CF_TURNSTILE_SITE_KEY = import.meta.env.VITE_CF_TURNSTILE_SITE_KEY;

declare const turnstile: {
    render: (
        containerID: string,
        options: {
            sitekey: string;
            theme?: 'auto' | 'light' | 'dark';
            size?: 'normal' | 'flexible' | 'compact';
            execution?: 'render' | 'execute';
            appearance?: 'always' | 'execute' | 'interaction-only';
            callback?: (token: string) => void;
            'error-callback'?: () => void;
        },
    ) => string;
    getResponse: (widgetID: string) => string;
    isExpired: (widgetID: string) => boolean;
    reset: (widgetID: string) => void;
    remove: (widgetID: string) => void;
    execute: (containerID: string) => void;
};

export default function useTurnstile(containerID: string) {
    const [token, setToken] = useState<string | null>(import.meta.env.MODE === 'development' ? 'dev-mode-token' : null);
    const widgetIdRef = useRef<string>(null);

    useEffect(() => {
        if (import.meta.env.MODE === 'development') return;

        const widgetID = turnstile.render(`#${containerID}`, {
            sitekey: CF_TURNSTILE_SITE_KEY,
            theme: 'light',
            size: 'flexible',
            callback: (token) => {
                setToken(token);
            },
            'error-callback': () => {
                setToken(null);
            },
        });
        widgetIdRef.current = widgetID;

        return () => {
            turnstile.remove(widgetID);
        };
    }, [containerID]);

    return {
        token,
        reset: () => {
            if (widgetIdRef.current) turnstile.reset(widgetIdRef.current);
        },
    };
}
