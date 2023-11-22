import APIClient from '../../APIClient';
import { Tag } from '../../types/level/Tag';

export interface TagSubmission extends Tag {
    LevelID: number;
    Percent: number;
    HasVoted: boolean;
}

export async function LevelTagRequest(levelID: number): Promise<TagSubmission[]> {
    return await APIClient.get('/level/tags', { params: { levelID } }).then((res) => {
        const data = res.data as (Omit<TagSubmission, 'HasVoted'> & { HasVoted: 0|1 })[]

        return data.map((tag) => ({
            LevelID: levelID,
            TagID: tag.TagID,
            Name: tag.Name,
            Description: tag.Description,
            Percent: tag.Percent,
            HasVoted: tag.HasVoted === 1,
        }));
    });
}