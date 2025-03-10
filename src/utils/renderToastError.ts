import { AxiosError } from 'axios';

const renderToastError = {
    render: render,
}

export default renderToastError;

export function render({ data }: { data?: Error }) {
    if (data instanceof AxiosError) return parseRequest(data);
    return data?.message ?? 'An unknown error occurred';
}

export function parseRequest(req: AxiosError): string {
    return (req.response?.data as { error: string } | undefined)?.error ?? `[${req.response?.status ?? -1}]: An error occurred`;
}
