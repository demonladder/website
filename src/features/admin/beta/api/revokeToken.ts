import APIClient from '../../../../api/APIClient';

export async function revokeToken(tokenID: number) {
    await APIClient.delete(`/beta/tokens/${tokenID}`);
}
