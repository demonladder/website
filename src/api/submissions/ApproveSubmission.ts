import APIClient from '../APIClient';

export default async function ApproveSubmission(levelID: number, userID: number, onlyEnjoyment = false) {
    await APIClient.put('/v2/submissions/approve', { levelID, userID, onlyEnjoyment });
}