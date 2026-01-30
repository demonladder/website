import APIClient from '../../../api/APIClient';

export async function sendTagVoteRequest(levelID: number, tagID: number) {
    await APIClient.post(`/levels/${levelID}/tags`, { tagID });
}
