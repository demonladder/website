import APIClient from '../APIClient';
import { TinyUser } from '../types/TinyUser';

export async function SearchUser(name: string, chunk = 5): Promise<TinyUser[]> {
    const res = await APIClient.get(`/user/search`, { params: { name, chunk } });
    return res.data;
}