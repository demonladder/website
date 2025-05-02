import APIClient from '../../APIClient';

export async function deleteSubmissions(userID: number) {
    await APIClient.delete(`/user/${userID}/submissions`);
}
