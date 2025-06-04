import APIClient from '../../../../api/APIClient';

export async function generateToken(userID: number) {
    const res = await APIClient.post<string>('/beta/tokens', { userID });
    return res.data;
}
