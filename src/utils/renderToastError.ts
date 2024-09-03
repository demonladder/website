import { AxiosError } from 'axios';

export default {
    render: ({ data }: { data?: AxiosError}) => {
        return (data?.response?.data as any)?.error ?? `[${data?.response?.status ?? -1}]: An error occurred`;
    },
}