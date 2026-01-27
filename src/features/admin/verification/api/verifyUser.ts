import APIClient from '../../../../api/APIClient';

export async function verifyUser(userID: number): Promise<void> {
    await APIClient.post(`/verification/verify/${userID}`);
}
