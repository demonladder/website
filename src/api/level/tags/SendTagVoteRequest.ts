import APIClient from '../../APIClient';

export default async function SendTagVoteRequest(levelID: number, tagID: number) {
    await APIClient.post(`/level/${levelID}/tags`, { tagID });
}