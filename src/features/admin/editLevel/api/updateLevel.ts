import APIClient from '../../../../api/APIClient';
import { Level } from '../../../../api/types/Level';

interface UpdateLevelRequest {
    duration: number | null;
    defaultRating: string;
    showcase: string;
}

export async function updateLevel(levelID: number, data: UpdateLevelRequest) {
    const sanitizedDefaultRating = parseInt(data.defaultRating.trim()) || null;
    const sanitizedShowcase = data.showcase || null;

    const res = await APIClient.put<Level>(`/levels/${levelID}`, {
        defaultRating: sanitizedDefaultRating,
        duration: data.duration,
        showcase: sanitizedShowcase,
    });
    return res.data;
}
