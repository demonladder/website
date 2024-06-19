import { AxiosError } from 'axios';
import { ToastContentProps } from 'react-toastify';

export default {
    render: ({ data }: ToastContentProps<AxiosError>) => (data?.response?.data as any)?.error ?? `[${data?.response?.status ?? -1}]: An error occurred`,
}