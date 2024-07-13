import APIClient from '../APIClient';

export default async function DeletePendingSubmission(levelID: number, userID: number) {
    await APIClient.delete(`/user/${userID}/submissions/pending/${levelID}`);
}