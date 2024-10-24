import { toast } from 'react-toastify';

export default function validateParameter(valid: boolean, value: string, name: string): boolean {
    if (!value.includes('.')) toast.error(`${name} must be a float. Did you mean ${value}.0?`);
    else toast.error(`${name} must be a number`);

    if (valid) return false;
    return true;
}