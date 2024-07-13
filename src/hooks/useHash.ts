import { useCallback, useEffect, useState } from 'react';

export default function useHash(): [string, (newHash: string) => void] {
    const [hash, setHash] = useState(() => window.location.hash.substring(1));

    const hashChangeHandler = useCallback(() => {
        setHash(window.location.hash.substring(1));
    }, []);

    useEffect(() => {
        window.addEventListener('hashchange', hashChangeHandler);
        return () => {
            window.removeEventListener('hashchange', hashChangeHandler);
        };
    }, []);

    const updateHash = useCallback(
        (newHash: string) => {
            if (newHash !== hash) window.location.hash = newHash;
        },
        [hash]
    );

    return [hash, updateHash];
}