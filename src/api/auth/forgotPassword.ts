import APIClient from '../APIClient';

export async function forgotPassword(username: string) {
    await APIClient.post('/account/forgotPassword', { username });
}
