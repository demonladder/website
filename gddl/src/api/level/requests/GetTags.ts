import APIClient from '../../axios';
import { Tag } from '../../types/level/Tag';

export function GetTags(): Promise<Tag[]> {
    return APIClient.get('/tags').then((res) => res.data);
}