import APIClient from '../APIClient';
import Role from '../types/Role';

export async function getUserRoles(userID: number) {
    const res = await APIClient.get<Role[]>(`/user/${userID}/roles`);
    return res.data;
}
