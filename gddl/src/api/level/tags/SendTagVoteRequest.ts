import APIClient from '../../APIClient';

export default async function SendTagVoteRequest(levelID: number, tagID: number) {
    await APIClient.post('/level/tags', { levelID, tagID })
}