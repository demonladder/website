import { useState } from 'react';
import { isStringAFloat } from '../utils/validators/isStringAFloat';

export default function useValidFloat(initial: string): [string, (value: string) => void, boolean] {
    const [value, setValue] = useState(initial);
    const [isValid, setIsValid] = useState(true);

    const onSetValue = (newValue: string) => {
        setValue(newValue);
        setIsValid(newValue === '' || isStringAFloat(newValue));
    };

    return [value, onSetValue, isValid];
}
