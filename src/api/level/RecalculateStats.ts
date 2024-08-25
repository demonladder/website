import APIClient from '../APIClient';

export default async function RecalculateStats(levelID: number) {
    await APIClient.post(`/level/${levelID}/recalculate`);
}