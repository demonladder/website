import APIClient from '../APIClient';

export async function reportUser(userID: number, reasonID: number, description: string) {
    await APIClient.post(`/user/${userID}/report`, {
        reasonID,
        description,
    });
}
