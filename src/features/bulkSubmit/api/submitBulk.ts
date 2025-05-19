import APIClient from '../../../api/APIClient';

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
export async function submitBulk(submissions: BulkSubmission[]) {
    const res = await APIClient.post<BulkSubmission[]>('/submissions/bulk', { submissions });
    return res.data;
}
