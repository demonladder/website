import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { GDDLError } from '../utils/renderToastError';
import APIClient from '../api/APIClient';

export function useAPI() {
    const navigate = useNavigate();

    useEffect(() => {
        const ID = APIClient.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status !== 401) throw error;

                if ((error.response.data as GDDLError).message !== 'TOTP_REQUIRED') throw error;

                void navigate('/auth/totp/authenticate');
                throw error;
            },
        );

        return () => {
            APIClient.interceptors.response.eject(ID);
        };
    }, [navigate]);

    return APIClient;
}
