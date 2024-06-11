import axios, { AxiosError } from 'axios';
import StorageManager from '../utils/StorageManager';

const APIClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL as string,
    timeout: 10000,
});

APIClient.interceptors.request.use((config) => {
    const token = StorageManager.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let refreshAuth: Promise<void> | null = null;
APIClient.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.response?.status !== 401) {
        return Promise.reject(error);
    }

    if (refreshAuth === null) refreshAuth = axios.post((import.meta.env.VITE_SERVER_URL as string) + '/login/refresh', { token: StorageManager.getToken() }).then((res) => {
        StorageManager.setUser(res.data);
    }).finally(() => refreshAuth = null).catch((_err) => Promise.reject(error));

    const originalConfig = error.config;
    delete originalConfig?.headers.Authorization;

    if (!originalConfig) return Promise.reject(error);
    return refreshAuth.then(() => APIClient.request(originalConfig))
});

export default APIClient;