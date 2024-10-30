import { useState, useEffect, useMemo } from 'react';
import isStringAFloat from '../utils/validators/isStringAFloat';
import isStringAnInteger from '../utils/validators/isStringAnInteger';

export default function useValidNumber(initial: string) {
    const [value, setValue] = useState(initial);
    const [isValid, setIsValid] = useState(true);
    const isInteger = useMemo(() => isStringAnInteger(value), [value]);
    const isFloat = useMemo(() => isStringAFloat(value), [value]);

    useEffect(() => {
        setIsValid(value === '' || isInteger || isFloat);
    }, [value, isInteger, isFloat]);

    return {
        value,
        setValue,
        isValid,
        isFloat,
        isInteger,
    };
}