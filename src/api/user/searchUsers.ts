import APIClient from '../APIClient';
import type { PaginatedResponse } from '../types/PaginatedResponse';
import User from '../types/User';
import type { PaginatedOptions } from '../types/PaginatedOptions';
import type Role from '../types/Role';

export interface SearchUserOptions extends PaginatedOptions {
    name?: string | null;
    excludeBots?: boolean | null;
}

export interface UserWithRoles extends Pick<User, 'ID' | 'Name' | 'Introduction' | 'avatar'> {
    roles: Pick<Role, 'ID' | 'Name' | 'Color'>[];
}

export async function searchUsers({ name, limit = 5, page = 0, excludeBots = true }: SearchUserOptions = {}) {
    const res = await APIClient.get<PaginatedResponse<UserWithRoles>>('/user', {
        params: {
            name: name || undefined,
            limit: limit,
            page: page,
            excludeBots,
        },
    });

    if (res.data.total > 0 && res.data.data.length === 0 && page > 0) {
        return await searchUsers({ name, limit, page: 0 });
    }

    return res.data;
}
