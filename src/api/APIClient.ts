import axios, { AxiosError } from 'axios';
import ms from 'ms';
import _ from 'lodash';

const APIClient = axios.create({
    baseURL: '/api',
    timeout: 10000,
    withCredentials: true,
});

// Stop sending requests after 15 errors
APIClient.interceptors.request.use((config) => {
    const controller = new AbortController();

    if (errorCounter >= 15) {
        controller.abort();
    }

    config.signal = controller.signal;
    return config;
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
                "Seriously, what makes you think it's gonna work now?",
                'Patience is a virtue, dumbass.',
                'Insanity is doing the same thing over and over expecting a different result.',
                "Go play Tidal Wave while you're bored",
                "If you try again one more time I'm going to fucking steal your fingers",
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
    } else if (errorCounter >= 3) {
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

// APIClient.interceptors.request.use((config) => {
//     const sessionToken = localStorage.getItem(import.meta.env.VITE_SESSION_ID_NAME);
//     if (sessionToken) config.headers.Authorization = `Bearer ${sessionToken}`;
//     return config;
// });

APIClient.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.response?.status !== 401) throw error;
    if ((error.response?.data as { error: string }).error !== 'Authentication failed!') throw error;

    throw new Error('You have been logged out due to inactivity.');
});

export default APIClient;
