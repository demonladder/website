import APIClient from '../APIClient';

export type SubmittableSubmission = {
    levelID: number,
    rating: number | null,
    enjoyment: number | null,
    refreshRate?: number,
    device?: number,
    proof?: string,
    progress: number,
    attempts?: number,
    isSolo?: boolean,
    secondPlayerID?: number,
}

export default async function SendSubmission(submission: SubmittableSubmission) {
    const res = await APIClient.post<{ wasAuto: boolean }>('/submit', { ...submission });
    return res.data;
}