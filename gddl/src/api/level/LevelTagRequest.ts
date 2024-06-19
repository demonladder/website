import APIClient from '../APIClient';
import { Tag } from '../types/level/Tag';

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

export async function LevelTagRequest(levelID: number): Promise<TopTags[]> {
    return await APIClient.get('/level/tags', { params: { levelID } }).then((res) => res.data);
}