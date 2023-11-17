import APIClient from '../../APIClient';

interface Response {
    eligible: boolean;
    vote?: number;
}

export function GetTagEligibility(levelID: number): Promise<Response> {
    return APIClient.get('/level/tags/eligible', { params: { levelID } }).then((res) => res.data);
}