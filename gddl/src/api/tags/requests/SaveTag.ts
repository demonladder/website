import APIClient from '../../APIClient';
import { Tag } from '../../types/level/Tag';

export function SaveTag(tag: Tag) {
    return APIClient.patch('/tags', { tagID: tag.TagID, name: tag.Name, description: tag.Description });
}