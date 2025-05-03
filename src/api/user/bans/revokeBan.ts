import APIClient from '../../APIClient';

export async function revokeBan(banID: number) {
    await APIClient.patch(`/bans/${banID}/revoke`);
}
