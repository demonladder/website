import APIClient from '../APIClient';

export default async function DeleteSubmission(ID: number, reason?: string) {
    await APIClient.delete(`/submissions/${ID}`, {
        data: {
            reason,
        },
    });
}
