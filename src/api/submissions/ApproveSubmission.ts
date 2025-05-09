import APIClient from '../APIClient';

export default async function ApproveSubmission(ID: number, enjoymentOnly = false, proofReviewTime?: number | null) {
    await APIClient.post(`/submissions/pending/${ID}/approve`, {
        enjoymentOnly,
        proofReviewTime,
    });
}
