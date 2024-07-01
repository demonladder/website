import APIClient from '../APIClient';
import { Tag } from '../types/level/Tag';

export default async function SaveTag(tag: Tag, name: string, description?: string | null) {
    await APIClient.patch('/tags', { tagID: tag.ID, name, description });
}