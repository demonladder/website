import { useEffect, useState } from 'react';

export default function useSessionStorage<T>(
    key: string,
    defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
    const stored = sessionStorage.getItem(key);
    const [value, setValue] = useState(stored === null ? defaultValue : (JSON.parse(stored) as T));

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
