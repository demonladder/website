import APIClient from '../APIClient';

export interface BulkSubmission {
    levelID: number | null;
    levelName: string | null;
    creator: string | null;
    tier: number | null;
    enjoyment: number | null;
    FPS: number;
    device: 'pc' | 'mobile' | null;
    videoProof: string | null;
}

// Returns failed submissions
export default async function SubmitBulk(submissions: BulkSubmission[]) {
    const res = await APIClient.post<{ levelID?: number, levelName?: string, creator?: string }[]>('/submit/bulk', { submissions });
    return res.data;
}