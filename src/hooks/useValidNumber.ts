import { useState } from 'react';
import { isStringAFloat } from '../utils/validators/isStringAFloat';
import isStringAnInteger from '../utils/validators/isStringAnInteger';

export default function useValidNumber(initial: string) {
    const [value, setValue] = useState(initial);
    const [isValid, setIsValid] = useState(true);
    const [isInteger, setIsInteger] = useState(isStringAnInteger(initial));
    const [isFloat, setIsFloat] = useState(isStringAFloat(initial));

    const onSetValue = (newValue: string) => {
        setValue(newValue);
        const isInteger = isStringAnInteger(newValue);
        const isFloat = isStringAFloat(newValue);
        setIsValid(newValue === '' || isInteger || isFloat);
        setIsInteger(isInteger);
        setIsFloat(isFloat);
    };

    return {
        value,
        setValue: onSetValue,
        isValid,
        isFloat,
        isInteger,
    };
}
