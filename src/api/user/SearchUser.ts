import APIClient from '../APIClient';
import User from '../types/User';

export default async function SearchUser(name: string, chunk = 5) {
    const res = await APIClient.get<User[]>(`/user/search`, { params: { name, chunk } });
    return res.data;
}