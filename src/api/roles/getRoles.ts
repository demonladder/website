import APIClient from '../APIClient';
import Role from '../types/Role';

export async function getRoles() {
    const res = await APIClient.get<Role[]>('/roles');
    return res.data;
}
