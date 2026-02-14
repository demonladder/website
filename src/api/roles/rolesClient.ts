import APIClient from '../APIClient';
import type Role from '../types/Role';
import type User from '../types/User';

interface UpdateRoleRequest {
    color: number | null;
    name?: string;
    permissions?: number;
}

class RolesClient {
    async create(name: string) {
        await APIClient.post('/roles', { name });
    }

    async list() {
        const res = await APIClient.get<Role[]>('/roles');
        return res.data;
    }

    async listMembers(roleID: number) {
        const res = await APIClient.get<{ users: User[] }>(`/roles/${roleID}/users`);
        return res.data;
    }

    async update(roleID: number, options: UpdateRoleRequest) {
        await APIClient.patch(`/roles/${roleID}`, options);
    }

    async delete(roleID: number) {
        await APIClient.delete(`/roles/${roleID}`);
    }
}

export const rolesClient = new RolesClient();
