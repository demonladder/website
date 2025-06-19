import APIClient from '../../APIClient';

export async function revokeBan(userID: number) {
    await APIClient.delete(`/bans/${userID}`);
}
