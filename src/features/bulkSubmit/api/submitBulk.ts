import APIClient from '../../../api/APIClient';
import { Device } from '../../../api/core/enums/device.enum';

export interface BulkSubmission {
    levelID?: number;
    levelName?: string;
    creator?: string;
    tier?: number;
    enjoyment?: number;
    FPS?: number;
    device: Device;
    videoProof?: string;
}

// Returns failed submissions
export async function submitBulk(submissions: BulkSubmission[]) {
    const res = await APIClient.post<BulkSubmission[]>('/submissions/bulk', { submissions });
    return res.data;
}
