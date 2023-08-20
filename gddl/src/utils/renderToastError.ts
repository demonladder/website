import { AxiosError } from 'axios';
import { ToastContentProps } from 'react-toastify';

export default {
    render: function renderToastError({ data }: ToastContentProps<AxiosError>) {
        return (data?.response?.data as any).error || 'An error occurred';
    }
}