import APIClient from '../../APIClient';

export async function deletePendingSubmissions(userID: number) {
    await APIClient.delete(`/user/${userID}/submissions/pending`);
}
