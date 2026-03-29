import APIClient from '../../../../api/APIClient';
import type { Device } from '../../../../api/core/enums/device.enum';

export interface ImportSaveRequest {
    levels: [number, number, number][];
    device: Device;
    refreshRate: number;
}

interface ImportSaveResponse {
    failedLevels: number[];
    nonUniqueLevels: number[];
    skippedLevels: number[];
}

export async function importSave(options: ImportSaveRequest) {
    const res = await APIClient.post<ImportSaveResponse>('/submissions/import-save', options, { timeout: 30_000 });
    return res.data;
}
