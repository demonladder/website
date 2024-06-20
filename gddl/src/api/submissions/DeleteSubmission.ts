import APIClient from '../APIClient';

export default async function DeleteSubmission(levelID: number, userID: number) {
    await APIClient.delete('/submissions', { data: { levelID, userID } });
}