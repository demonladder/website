import APIClient from '../../../../api/APIClient';
import { Achievement } from '../../../../api/types/Achievement';

export interface CreateAchievementRequest {
    name: string;
    discordRoleId?: string | null;
    iconSource?: string | null;
}

export async function createAchievement(request: CreateAchievementRequest) {
    const res = await APIClient.post<Achievement>('/achievements', request);
    return res.data;
}
