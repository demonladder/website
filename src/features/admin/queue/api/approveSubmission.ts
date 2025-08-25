import APIClient from '../../../../api/APIClient';

export async function approveSubmission(ID: number, enjoymentOnly = false, proofReviewTime?: number | null) {
    await APIClient.post(`/submissions/pending/${ID}/approve`, {
        enjoymentOnly,
        proofReviewTime,
    });
}
