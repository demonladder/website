import APIClient from '../APIClient';

export default async function ApproveSubmission(ID: number, enjoymentOnly = false) {
    await APIClient.put(`/submissions/${ID}/approve`, { enjoymentOnly });
}
