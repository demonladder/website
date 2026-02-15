import type { SubmissionStatus } from '../../features/profile/api/getUserPendingSubmissions';
import APIClient from '../APIClient';
import type { Device } from '../core/enums/device.enum';

interface SubmitRequest {
    levelID: number;
    rating?: number | null;
    enjoyment?: number | null;
    refreshRate?: number;
    device?: Device;
    proof?: string | null;
    isProofPrivate?: boolean;
    progress?: number;
    status?: SubmissionStatus;
    attempts?: number;
    isSolo?: boolean;
    secondPlayerID?: number;
}

export async function sendSubmission(submission: SubmitRequest) {
    const res = await APIClient.post<{ wasAuto: boolean }>('/submissions', submission);
    return res.data;
}
