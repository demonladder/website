import APIClient from '../../../api/APIClient';
import LevelMeta from '../../level/types/LevelMeta';
import PendingSubmission from '../../../api/types/PendingSubmission';
import { Level } from '../../../api/types/Level';
import { Publisher } from '../../../api/types/Publisher';
import Song from '../../level/types/Song';

export type UserPendingSubmission = Pick<PendingSubmission, 'ID' | 'Rating' | 'Enjoyment' | 'Proof' | 'DateAdded'> & {
    Position?: number;
    Level: Pick<Level, 'ID' | 'Rating' | 'Enjoyment'> & {
        Meta: Pick<LevelMeta, 'Name' | 'Difficulty' | 'Length' | 'Rarity' | 'IsTwoPlayer'> & {
            Song: Pick<Song, 'Name'>;
            Publisher: Pick<Publisher, 'name'> | null;
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
    const res = await APIClient.get<GetUserPendingSubmissionsResponse>(`/user/${userID}/submissions`, {
        params: { pending: true, sort: 'dateChanged', page: options?.page, limit: 12 },
    });
    return res.data;
}
