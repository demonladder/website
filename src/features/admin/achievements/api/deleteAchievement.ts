import APIClient from '../../../../api/APIClient';

export async function deleteAchievement(achievementId: string) {
    await APIClient.delete(`/achievements/${achievementId}`);
}
