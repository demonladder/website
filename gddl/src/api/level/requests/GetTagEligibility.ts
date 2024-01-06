import APIClient from '../../APIClient';

interface Eligibility {
    eligible: boolean;
    vote?: number;
}

export function GetTagEligibility(levelID: number): Promise<Eligibility> {
    return APIClient.get('/level/tags/eligible', { params: { levelID } }).then((res) => res.data);
}