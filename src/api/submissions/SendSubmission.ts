import APIClient from '../APIClient';
import { Device } from '../core/enums/device.enum';

interface SubmitDTO {
    levelID: number;
    rating?: number;
    enjoyment?: number;
    refreshRate?: number;
    device?: Device;
    proof?: string;
    progress?: number;
    attempts?: number;
    isSolo?: boolean;
    secondPlayerID?: number;
}

export default async function SendSubmission(submission: SubmitDTO) {
    const res = await APIClient.post<{ wasAuto: boolean }>('/submissions', submission);
    return res.data;
}
