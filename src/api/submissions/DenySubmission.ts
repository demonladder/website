import APIClient from '../APIClient';

export default async function DenySubmission(ID: number, reason: string, shouldBlacklistProof: boolean) {
    await APIClient.delete(`/submissions/pending/${ID}/deny`, { params: { reason, shouldBlacklistProof } });
}
