import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface GDDLError {
    message: string | string[];
    error: string;
    statusCode: number;
}

const renderToastError = {
    render: render,
};

export default renderToastError;

export function render({ data }: { data?: Error }) {
    if (data instanceof AxiosError) return parseRequest(data as AxiosError<GDDLError>);
    return data?.message ?? 'An unknown error occurred';
}

export function parseRequest(error: AxiosError<GDDLError>): string {
    if (!error.response) return error.message;

    if (Array.isArray(error.response.data.message)) {
        error.response.data.message.slice(1).forEach((message) => {
            toast.error(message);
        });
        return error.response.data.message[0];
    }

    return error.response.data.message ?? error.response.data.error ?? `[${error.response.status ?? -1}]: An error occurred`;
}
