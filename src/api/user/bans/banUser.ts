import APIClient from '../../APIClient';

export async function banUser(userID: number, duration: number | null, reason?: string) {
    await APIClient.post(`/user/${userID}/bans`, { duration, reason });
}
