import APIClient from '../../../api/APIClient';
import Level from '../../../api/types/Level';
import LevelMeta from '../../../api/types/LevelMeta';
import PendingSubmission from '../../../api/types/PendingSubmission';
import Song from '../../../api/types/Song';

export type UserPendingSubmission = PendingSubmission & { Level: Level & { Meta: LevelMeta & { Song: Song; }; }; };

interface GetUserPendingSubmissionsResponse {
    total: number;
    limit: number;
    page: number;
    submissions: UserPendingSubmission[];
}

export async function getUserPendingSubmissions(userID: number) {
    const res = await APIClient.get<GetUserPendingSubmissionsResponse>(`/user/${userID}/submissions`, { params: { pending: true } });
    return res.data;
}
