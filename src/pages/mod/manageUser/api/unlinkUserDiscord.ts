import APIClient from '../../../../api/APIClient';

export async function unlinkUserDiscord(userID: number) {
    await APIClient.delete(`/user/${userID}/discord`);
}
