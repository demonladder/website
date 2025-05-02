import APIClient from '../APIClient';
import User from '../types/User';

export default async function SearchUser(name: string, limit = 5) {
    const res = await APIClient.get<User[]>(`/user/search`, { params: { name, limit } });
    return res.data;
}