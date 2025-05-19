import APIClient from '../../../api/APIClient';

export async function accountLogin(username: string, password: string) {
    await APIClient.post<string>('/account/login', {
        username,
        password,
    });
}
