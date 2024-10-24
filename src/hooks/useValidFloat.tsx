import { useState, useEffect } from 'react';
import isStringAFloat from '../utils/validators/isStringAFloat';

export default function useValidFloat(initial: string): [string, (value: string) => void, boolean] {
    const [value, setValue] = useState(initial);
    const [valid, setValid] = useState(true);

    useEffect(() => {
        setValid(value === '' || isStringAFloat(value));
    }, [value]);

    return [value, setValue, valid];
}