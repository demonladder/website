import APIClient from '../APIClient';

export async function forgotPassword(username: string) {
    await APIClient.post('/login/forgotPassword', { username });
}
