import APIClient from '../../APIClient';

export function SendTagVoteRequest(levelID: number, tagID: number): Promise<void> {
    return APIClient.post('/level/tags', { levelID, tagID })
}