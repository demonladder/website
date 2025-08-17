import APIClient from '../APIClient';

export default async function DeletePendingSubmission(ID: number, reason?: string) {
    await APIClient.delete(`/submissions/pending/${ID}`, { data: { reason } });
}
