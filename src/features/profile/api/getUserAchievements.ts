import APIClient from '../../../api/APIClient';
import type { Achievement } from '../../../api/types/Achievement';

type GetUserAchievementsResponse = Pick<Achievement, 'id' | 'name' | 'iconSource'>[];

export async function getUserAchievements(userId: number) {
    const res = await APIClient.get<GetUserAchievementsResponse>(`/user/${userId}/achievements`);
    return res.data;
}
