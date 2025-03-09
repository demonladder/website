import { useEffect, useState } from 'react';

export default function useLocalStorage<T>(key: string, defaultValue?: T): [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] {
    const stored = localStorage.getItem(key);
    const [value, setValue] = useState(stored === null ? defaultValue : JSON.parse(stored) as T);

    useEffect(() => {
        if (value !== undefined) localStorage.setItem(key, JSON.stringify(value));
        else localStorage.removeItem(key);
    }, [value, key]);

    return [value, setValue];
}
