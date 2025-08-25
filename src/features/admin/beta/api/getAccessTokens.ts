import APIClient from '../../../../api/APIClient';

interface GetAccessTokensResponse {
    limit: number;
    page: number;
    total: number;
    tokens: {
        ID: number;
        ownerID: number;
        uses: number;
        createdAt: string;
        updatedAt: string;
        Owner: {
            ID: number;
            Name: string;
            RoleIDs: string;
        };
    }[];
}

export async function getAccessTokens() {
    const res = await APIClient.get<GetAccessTokensResponse>('/beta/tokens');
    return res.data;
}
