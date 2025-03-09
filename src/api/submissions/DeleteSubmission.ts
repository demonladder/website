import APIClient from '../APIClient';

export default async function DeleteSubmission(levelID: number, userID: number, reason = '') {
    await APIClient.delete(`/user/${userID}/submissions/${levelID}`, { data: {
        reason: reason !== undefined ? (reason.length > 0 ? reason : undefined) : undefined,
    } });
}
