import APIClient from '../APIClient';

export default async function DeleteSubmission(ID: number, reason = '') {
    await APIClient.delete(`/submissions/${ID}`, {
        data: {
            reason: reason ? reason : undefined,  // Turn empty string into undefined
        },
    });
}
