import APIClient from '../APIClient';

export default async function DenySubmission(levelID: number, userID: number, reason?: string) {
    await APIClient.delete('/submissions/deny', { params: { levelID, userID, reason } });
}