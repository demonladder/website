import APIClient from '../APIClient';
import { TinyUser } from '../types/TinyUser';

export default async function SearchUser(name: string, chunk = 5) {
    const res = await APIClient.get<TinyUser[]>(`/user/search`, { params: { name, chunk } });
    return res.data;
}