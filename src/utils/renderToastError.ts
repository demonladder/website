import { AxiosError } from 'axios';

const renderToastError = {
    render: render,
}

export default renderToastError;
export function render({ data }: { data?: AxiosError}) {
    return data ? parseRequest(data) : 'An unknown error occurred';
}

export function parseRequest(req: AxiosError): string {
    return (req.response?.data as { error: string } | undefined)?.error ?? `[${req.response?.status ?? -1}]: An error occurred`;
}
