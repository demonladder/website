import APIClient from '../../../api/APIClient';

export async function getSkills(userID: number, levelSpan: string, minTagSubmissions: string, tierCorrection = false) {
    const n = isNaN(parseInt(levelSpan)) ? 200_000 : parseInt(levelSpan);

    const res = await APIClient.get<Record<string, number>>(`/user/${userID}/skills`, { params: {
        topSampleSize: n,
        minTagSubmissions,
        tierCorrection,
    } });
    return res.data;
}
