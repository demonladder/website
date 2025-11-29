import APIClient from '../../../api/APIClient';

export async function accountLogin(username: string, password: string, challenge: string, totpCode?: string) {
    await APIClient.post<string>('/account/login', {
        username,
        password,
        challenge,
        totpCode,
    });
}
