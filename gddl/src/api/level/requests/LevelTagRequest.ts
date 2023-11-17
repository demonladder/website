import APIClient from '../../APIClient';
import { Tag } from '../../types/level/Tag';

export interface TagSubmission extends Tag {
    Percent: number;
}

export async function LevelTagRequest(levelID: number): Promise<TagSubmission[]> {
    return await APIClient.get('/level/tags', { params: { levelID } }).then((res) => res.data as TagSubmission[]);
}