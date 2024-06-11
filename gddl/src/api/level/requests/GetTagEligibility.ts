import APIClient from '../../APIClient';

export interface TagEligibility {
    eligible: boolean;
    vote?: number;
}

export function GetTagEligibility(levelID: number): Promise<TagEligibility> {
    return APIClient.get('/level/tags/eligible', { params: { levelID } }).then((res) => res.data);
}