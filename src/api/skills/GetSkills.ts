import APIClient from '../APIClient';

export default async function GetSkills(userID: number, levelSpan: string, minTagSubmissions: string, tierCorrection = false) {
    const n = isNaN(parseInt(levelSpan)) ? 200_000 : parseInt(levelSpan);

    const res = await APIClient.get<Record<string, number>>(`/user/${userID}/skills`, { params: {
        topSampleSize: n,
        minTagSubmissions,
        tierCorrection,
    } });
    return res.data;
}
