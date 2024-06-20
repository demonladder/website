import APIClient from '../../APIClient';

export interface TagEligibility {
    eligible: boolean;
    vote?: number;
}

export default async function GetTagEligibility(levelID: number) {
    const res = await APIClient.get<TagEligibility>('/level/tags/eligible', { params: { levelID } });
    return res.data;
}