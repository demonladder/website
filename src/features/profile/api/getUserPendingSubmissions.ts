import APIClient from '../../../api/APIClient';
import { Difficulties, LevelLengths, Rarity } from '../../level/types/LevelMeta';
import PendingSubmission from '../../../api/types/PendingSubmission';

export type UserPendingSubmission = PendingSubmission & {
    Position?: number,
    Level: {
        ID: number;
        Rating: number | null;
        Enjoyment: number | null;
        Meta: {
            Name: string;
            Creator: string;
            Difficulty: Difficulties;
            Length: LevelLengths;
            Rarity: Rarity;
            IsTwoPlayer: boolean;
            Song: {
                Name: string;
            };
        };
    };
};

interface GetUserPendingSubmissionsResponse {
    total: number;
    limit: number;
    page: number;
    submissions: UserPendingSubmission[];
}

export interface GetUserPendingSubmissionOptions {
    page?: number;
}

export async function getUserPendingSubmissions(userID: number, options?: GetUserPendingSubmissionOptions) {
    const res = await APIClient.get<GetUserPendingSubmissionsResponse>(`/user/${userID}/submissions`, { params: { pending: true, sort: 'dateChanged', page: options?.page, limit: 12 } });
    return res.data;
}
