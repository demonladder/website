import APIClient from '../../../api/APIClient';

export interface TagEligibility {
    eligible: boolean;
}

export async function getTagEligibility(levelID: number) {
    const res = await APIClient.get<TagEligibility>(`/level/${levelID}/tags/eligible`, { params: { levelID } });
    return res.data;
}
