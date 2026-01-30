import APIClient from '../../../api/APIClient';

export async function removeTagVotes(levelID: number, tagID: number) {
    await APIClient.delete(`/levels/${levelID}/tags/${tagID}`);
}
