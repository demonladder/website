import APIClient from '../APIClient';
import Role from '../types/Role';

export default async function GetRoles() {
    const res = await APIClient.get<Role[]>('/roles');
    return res.data;
}