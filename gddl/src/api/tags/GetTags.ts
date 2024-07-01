import APIClient from '../APIClient';
import { Tag } from '../types/level/Tag';

export default async function GetTags() {
    const res = await APIClient.get<Tag[]>('/tags');
    return res.data;
}