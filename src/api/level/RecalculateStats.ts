import APIClient from '../APIClient';

export default async function RecalculateStats(levelID: number) {
    await APIClient.patch(`/level/${levelID}/recalculate`);
}
