import APIClient from '../APIClient';
import type Role from '../types/Role';
import type User from '../types/User';

export interface GetVerifiedRequest {
    page?: number;
    limit?: number;
    verificationRoleID?: number;
}

interface GetVerifiedResponse {
    total: number;
    users: User[];
}

class UsersClient {
    async addRole(userID: number, roleID: number) {
        await APIClient.post(`/roles/${roleID}/users/${userID}`);
    }

    async getRoles(userID: number) {
        const res = await APIClient.get<Role[]>(`/user/${userID}/roles`);
        return res.data;
    }

    async getVerified(options?: GetVerifiedRequest) {
        if (options?.verificationRoleID === undefined) return { total: 0, users: [] };

        const res = await APIClient.get<GetVerifiedResponse>(`/roles/${options.verificationRoleID}/users`, {
            params: {
                page: options?.page,
                limit: options?.limit,
            },
        });
        return res.data;
    }

    async removeRole(userID: number, roleID: number) {
        await APIClient.delete(`/roles/${roleID}/users/${userID}`);
    }
}

export const usersClient = new UsersClient();
