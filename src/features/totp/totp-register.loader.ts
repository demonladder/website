import { AxiosError } from 'axios';
import APIClient from '../../api/APIClient';
import { redirect } from 'react-router';

export async function totpRegisterLoader() {
    try {
        const res = await APIClient.post<string>('/auth/totp/add');
        return res.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.status === 401) return redirect('/login');
        }

        throw error;
    }
}
