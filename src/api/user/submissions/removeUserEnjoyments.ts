import APIClient from '../../APIClient';

export async function removeUserEnjoyments(userID: number) {
    await APIClient.delete(`/user/${userID}/submissions/enjoyments`);
}
