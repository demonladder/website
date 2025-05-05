import APIClient from '../APIClient';

export interface BulkSubmission {
    levelID?: number;
    levelName?: string;
    creator?: string;
    tier?: number;
    enjoyment?: number;
    FPS?: number;
    device: 'pc' | 'mobile';
    videoProof?: string;
}

// Returns failed submissions
export default async function SubmitBulk(submissions: BulkSubmission[]) {
    const res = await APIClient.post<BulkSubmission[]>('/submissions/bulk', { submissions });
    return res.data;
}
