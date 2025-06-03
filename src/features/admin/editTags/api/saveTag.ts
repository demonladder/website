import APIClient from '../../../../api/APIClient';
import { Tag } from '../../../../api/types/level/Tag';

export async function saveTag(tag: Tag, name: string, description?: string | null) {
    await APIClient.patch('/tags', { tagID: tag.ID, name, description });
}
