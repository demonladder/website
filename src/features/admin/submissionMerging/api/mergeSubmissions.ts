import APIClient from '../../../../api/APIClient';
import { ModeType } from './enums/ModeType';

export async function mergeSubmissions(sourceUserID: number, targetUserID: number, mode: ModeType) {
    await APIClient.post('/submissions/merge', {
        sourceUserID,
        targetUserID,
        mode,
    });
}
