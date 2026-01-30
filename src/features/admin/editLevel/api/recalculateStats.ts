import APIClient from '../../../../api/APIClient';

export async function recalculateLevelStats(levelID: number) {
    await APIClient.patch(`/levels/${levelID}/recalculate`);
}
