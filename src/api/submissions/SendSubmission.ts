import APIClient from '../APIClient';

export type SubmittableSubmission = {
    levelID: number,
    rating?: number,
    enjoyment?: number,
    refreshRate?: number,
    device?: number,
    proof?: string,
    isSolo?: boolean,
    secondPlayerID?: number,
}

export default async function SendSubmission(submission: SubmittableSubmission) {
    const res = await APIClient.post<{ wasAuto: boolean }>('/submit', { ...submission });
    return res.data;
}