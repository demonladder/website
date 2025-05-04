import APIClient from '../../APIClient';

export async function removeUserEnjoyments(userID: number) {
    await APIClient.patch(`/user/${userID}/submissions/enjoyments`);
}
