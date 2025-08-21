import APIClient from '../../../api/APIClient';

interface Options {
    levelSpan: string;
    tierCorrection?: boolean;
    adjustRarity?: boolean;
}

export async function getSkills(userID: number, { levelSpan, tierCorrection = false, adjustRarity = true  }: Options) {
    const n = isNaN(parseInt(levelSpan)) ? 200_000 : parseInt(levelSpan);

    const res = await APIClient.get<Record<string, number>>(`/user/${userID}/skills`, { params: {
        topSampleSize: n,
        tierCorrection,
        adjustRarity,
    } });
    return res.data;
}
