import APIClient from '../../../../api/APIClient';
import { Level } from '../../../../api/types/Level';

interface UpdateLevelRequest {
    defaultRating: string;
    showcase: string;
}

export async function updateLevel(levelID: number, data: UpdateLevelRequest) {
    const sanitizedDefaultRating = parseInt(data.defaultRating.trim()) || null;
    const sanitizedShowcase = data.showcase || null;

    const res = await APIClient.put<Level>(`/level/${levelID}`, {
        defaultRating: sanitizedDefaultRating,
        showcase: sanitizedShowcase,
    });
    return res.data;
}
