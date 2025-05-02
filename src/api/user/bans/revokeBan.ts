import APIClient from '../../APIClient';

export async function revokeBan(banID: number) {
    await APIClient.delete('/user/ban/revoke', { params: { banID }});
}
