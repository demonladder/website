import APIClient from '../../APIClient';

export interface TagEligibility {
    eligible: boolean;
}

export default async function GetTagEligibility(levelID: number) {
    const res = await APIClient.get<TagEligibility>(`/level/${levelID}/tags/eligible`, { params: { levelID } });
    return res.data;
}