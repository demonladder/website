import APIClient from '../../../api/APIClient';

export async function accountLogin(username: string, password: string, challenge: string, totpCode?: string) {
    await APIClient.post<string>('/auth/login', {
        username,
        password,
        challenge,
        totpCode,
    });
}
