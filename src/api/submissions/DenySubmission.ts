import APIClient from '../APIClient';

export default async function DenySubmission(levelID: number, userID: number, reason?: string) {
    await APIClient.delete('/v2/submissions/deny', { params: { levelID, userID, reason } });
}