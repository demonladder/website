import APIClient from '../../../../api/APIClient';
import DiscordUserData from '../../../../api/types/DiscordUserData';
import User from '../../../../api/types/User';

export interface GetVerifiedUsersResponseOptions {
    page?: number;
    limit?: number;
    verificationRoleID?: number;
}

interface GetVerifiedUsersResponse {
    total: number;
    users: (User & {
        DiscordData: DiscordUserData;
    })[];
}

export async function getVerifiedUsers(options?: GetVerifiedUsersResponseOptions) {
    if (options?.verificationRoleID === undefined) return { total: 0, users: [] };

    const res = await APIClient.get<GetVerifiedUsersResponse>(`/roles/${options.verificationRoleID}/users`, {
        params: {
            page: options?.page,
            limit: options?.limit,
        },
    });
    return res.data;
}
