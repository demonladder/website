import StorageManager from '../../../utils/StorageManager';
import APIClient from '../../axios';
import { Tag } from '../../types/level/Tag';

export function SaveTag(tag: Tag) {
    const csrfToken = StorageManager.getCSRF();

    return APIClient.patch('/tags', { tagID: tag.TagID, name: tag.Name, description: tag.Description, csrfToken }, { withCredentials: true });
}