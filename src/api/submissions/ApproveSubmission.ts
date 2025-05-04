import APIClient from '../APIClient';

export default async function ApproveSubmission(ID: number, enjoymentOnly = false) {
    await APIClient.post(`/submissions/pending/${ID}/approve`, { enjoymentOnly });
}
