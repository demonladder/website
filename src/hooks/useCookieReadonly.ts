import Cookies from 'js-cookie';
import { useCallback, useEffect, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

export class CookieChangeEvent extends CustomEvent<{ name: string }> {
    constructor(name: string) {
        super('cookie-change', { detail: { name } });
    }
}

declare global {
    interface WindowEventMap {
        'cookie-change': CustomEvent<{ name: string }>;
    }
}

export default function useCookieReadonly(name: string) {
    const [cookie, setCookie] = useState<string | undefined>(Cookies.get(name));

    const readCookie = useCallback(() => Cookies.get(name), [name]);

    const refresh = useCallback(() => {
        setCookie(readCookie());

        window.dispatchEvent(new CookieChangeEvent(name));
    }, [name, readCookie]);

    const removeCookie = useCallback(() => {
        Cookies.remove(name);
        
        setCookie(undefined);

        window.dispatchEvent(new CookieChangeEvent(name));
    }, [name]);

    useEffect(() => {
        setCookie(readCookie());
    }, [name, readCookie]);

    const handleCookieChange = useCallback((e: CookieChangeEvent) => {
        if (e.detail.name === name) setCookie(readCookie());
    }, [name, readCookie]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    useEventListener('cookie-change', handleCookieChange);

    return [cookie, removeCookie, refresh] as const;
}