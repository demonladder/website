import APIClient from '../../APIClient';
import { Tag } from '../../types/level/Tag';

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

export default async function LevelTagRequest(levelID: number) {
    return await APIClient.get<TopTags[]>(`/level/${levelID}/tags`).then((res) => res.data);
}