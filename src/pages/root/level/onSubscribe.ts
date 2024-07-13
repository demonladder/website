import { AxiosError } from 'axios';
import APIClient from '../../../api/APIClient';
import { toast } from 'react-toastify';

export function onSubscribe(levelID: number) {
    APIClient.put(`/level/subscribe/${levelID}`).then(() => {
        toast.success('Subscribed');
    }).catch((err: AxiosError) => {
        toast.error((err.response?.data as any)?.error || 'An error ocurred, try again later');
    });
}