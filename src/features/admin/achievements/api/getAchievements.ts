import APIClient from '../../../../api/APIClient';
import { Achievement } from '../../../../api/types/Achievement';

export async function getAchievements() {
    const res = await APIClient.get<Achievement[]>('/achievements');
    return res.data;
}
