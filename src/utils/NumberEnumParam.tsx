import { QueryParamConfig } from 'use-query-params';

export function NumberEnumParam<T extends Record<number, unknown>>(options: T): QueryParamConfig<keyof T, keyof T | null> {
    return {
        encode: (value) => value.toString(),
        decode: (value) => {
            if (value === null) return null;

            const parsed = Number(value);
            if (isNaN(parsed)) return null;

            return options[parsed] ? parsed : null;
        },
    };
}
