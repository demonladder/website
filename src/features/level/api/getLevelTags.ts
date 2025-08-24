import APIClient from '../../../api/APIClient';
import { Tag } from '../../../api/types/level/Tag';

export interface TagSubmission extends Tag {
    LevelID: number;
    Percent: number;
    HasVoted: boolean;
}

export interface TopTags {
    TagID: number;
    ReactCount: number;
    HasVoted: 0 | 1;
    Tag: Omit<Tag, 'TagID'> & { ID: number };
}

export async function getLevelTags(levelID: number) {
    return await APIClient.get<TopTags[]>(`/level/${levelID}/tags`).then((res) => res.data);
}
