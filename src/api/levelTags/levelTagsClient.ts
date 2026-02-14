import APIClient from '../APIClient';

export interface Reaction {
    TagID: number;
    ReactCount: number;
    HasVoted: 0 | 1;
}

interface GetLevelTagsResponse {
    reactions: Reaction[];
}

class LevelTagsClient {
    async getLevelTags(levelID: number) {
        const res = await APIClient.get<GetLevelTagsResponse>(`/levels/${levelID}/tags`);
        return res.data;
    }

    async removeVotes(levelID: number, tagID: number) {
        await APIClient.delete(`/levels/${levelID}/tags/${tagID}`);
    }
}

export const levelTagsClient = new LevelTagsClient();
