import { toast } from 'react-toastify';

export function copyText(text: string) {
    void navigator.clipboard.writeText(text).then(() => {
        toast.success('Copied to clipboard');
    });
}
