import APIClient from '../APIClient';
import { Tag } from '../types/level/Tag';

export default async function SaveTag(tag: Tag) {
    await APIClient.patch('/tags', { tagID: tag.TagID, name: tag.Name, description: tag.Description });
}