import { useEffect, useState } from 'react';

/**
 * Holds a value for a certain amount of time before updating it
 * @param defaultValue The default value
 * @param delay The delay in milliseconds
 * @returns The current value, the late value, the setter for the current value, and the setter for the late value
 */
export default function useLateValue<T>(
    defaultValue: T,
    delay = 500,
): [T, T, React.Dispatch<React.SetStateAction<T>>, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState(defaultValue);
    const [lateValue, setLateValue] = useState(defaultValue);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLateValue(value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [value, delay]);

    return [value, lateValue, setValue, setLateValue];
}
