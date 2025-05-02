import APIClient from '../APIClient';

export async function reportUser(userID: number, reasonID: number, description: string) {
    await APIClient.post('/reportUser', {
        userID,
        reasonID,
        description,
    });
}
