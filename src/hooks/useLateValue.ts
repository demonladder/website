import { useEffect, useState } from 'react';

export default function useLateValue<T>(defaultValue: T, delay: number): [T, T, React.Dispatch<React.SetStateAction<T>>, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState(defaultValue);
    const [lateValue, setLateValue] = useState(defaultValue);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLateValue(value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [value]);

    return [value, lateValue, setValue, setLateValue];
}