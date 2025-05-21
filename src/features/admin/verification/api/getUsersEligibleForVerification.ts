import APIClient from '../../../../api/APIClient';

interface GetUsersEligibleForVerificationResponse {
    total: number;
    users: {
        ID: number;
        submissions: number;
        distinctApprovals: number;
    }[];
}

export interface GetUsersEligibleForVerificationOptions {
    page?: number;
    limit?: number;
}

export async function getUsersEligibleForVerification(options?: GetUsersEligibleForVerificationOptions) {
    const res = await APIClient.get<GetUsersEligibleForVerificationResponse>('/user/eligibleForVerification', {
        params: {
            page: options?.page,
            limit: options?.limit,
        },
    });
    return res.data;
}
