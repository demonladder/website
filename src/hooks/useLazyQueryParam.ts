import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useEffect, useState } from 'react';

export function useLazyQueryParam(paramName: string, def: string): [string, string, (value: string) => void] {
    const [value, setValue] = useQueryParam(paramName, withDefault(StringParam, def));
    const [lazyValue, setLazyValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLazyValue(value);
        }, 500);

        return () => clearTimeout(timeout);
    }, [value, setLazyValue]);

    return [value, lazyValue, setValue];
}
