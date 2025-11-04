import APIClient from '../APIClient';
import { Tag } from '../types/level/Tag';

export async function getTags() {
    const res = await APIClient.get<Tag[]>('/tags');
    return res.data;
}
