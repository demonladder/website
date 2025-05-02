import APIClient from '../APIClient';

export type SubmittableSubmission = {
    levelID: number,
    rating: number | null,
    enjoyment: number | null,
    refreshRate?: number | null,
    device?: 'pc' | 'mobile' | null,
    proof?: string | null,
    progress?: number | null,
    attempts?: number | null,
    isSolo?: boolean,
    secondPlayerID?: number,
};

export default async function SendSubmission(submission: SubmittableSubmission) {
    const res = await APIClient.post<{ wasAuto: boolean }>('/submissions', submission);
    return res.data;
}
