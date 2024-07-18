import axios, { AxiosError } from 'axios';
import StorageManager from '../utils/StorageManager';
import ms from 'ms';
import _ from 'lodash';

const APIClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    timeout: 10000,
});

APIClient.interceptors.request.use((config) => {
    const controller = new AbortController();

    if (errorCounter >= 15) {
        controller.abort();
    }

    const token = StorageManager.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.url === (import.meta.env.VITE_SERVER_URL) || config.url?.startsWith('/')) {
        config.headers['X-Access-Token'] = import.meta.env.VITE_ACCESS_TOKEN as string;
    }

    config.signal = controller.signal;
    return config;
});

let refreshAuth: Promise<void> | null = null;
APIClient.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.response?.status !== 401) {
        return Promise.reject(error);
    }

    if (refreshAuth === null) refreshAuth = axios.post<string>((import.meta.env.VITE_SERVER_URL) + '/login/refresh', { token: StorageManager.getToken() }).then((res) => {
        StorageManager.setUser(res.data);
    }).finally(() => refreshAuth = null).catch(() => Promise.reject(error));

    const originalConfig = error.config;
    delete originalConfig?.headers.Authorization;

    if (!originalConfig) return Promise.reject(error);
    return refreshAuth.then(() => APIClient.request(originalConfig))
});

let errorCounter = 0;
let resetCounter: NodeJS.Timeout | null = null;

APIClient.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.response?.status !== 500) {
        throw error;
    }

    errorCounter++;

    if (errorCounter >= 15) {
        error.response.data = {
            ...(error.response.data as object),
            error: 'You have been IP banned.',
        };
    } else if (errorCounter > 7) {
        error.response.data = {
            ...(error.response.data as object),
            error: _.sample([
                'Seriously, what makes you think it\'s gonna work now?',
                'Patience is a virtue, dumbass.',
                'Insanity is doing the same thing over and over expecting a different result.',
                'Go play Tidal Wave while you\'re bored',
                'If you try again one more time I\'m going to fucking steal your fingers',
                'stop',
                'Has life lost all meaning or why are you still trying?',
                'You have been banned from clicking for 24 hours, please try again tomorrow',
            ]),
        };
    } else if (errorCounter > 4) {
        error.response.data = {
            ...(error.response.data as object),
            error: 'Open a support thread instead of this nonsense',
        };
    } else if (errorCounter > 3) {
        error.response.data = {
            ...(error.response.data as object),
            error: 'What part of "try again later" do you not understand?',
        };
    }

    if (resetCounter === null) {
        resetCounter = setTimeout(() => {
            errorCounter = 0;
            resetCounter = null;
        }, ms('1m'));
    }

    throw error;
});

export default APIClient;