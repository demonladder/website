import APIClient from '../../APIClient';

export async function banUser(userID: number, duration: number, reason?: string) {
    await APIClient.post('/user/ban', { userID, duration: duration * 7 * 24 * 60 * 60, reason });  // Client uses weeks, api uses seconds
}
