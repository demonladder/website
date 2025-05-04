import APIClient from '../APIClient';

export default async function DeletePendingSubmission(ID: number) {
    await APIClient.delete(`/submissions/pending/${ID}`);
}
