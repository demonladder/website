import APIClient from '../APIClient';
import Level from '../types/Level';
import LevelMeta from '../types/LevelMeta';
import Song from '../types/Song';
import Submission from '../types/Submission';

export type UserPendingSubmission = Submission & { Level: Level & { Meta: LevelMeta & { Song: Song; }; }; };
interface GetUserPendingSubmissionsResponse {
    total: number;
    limit: number;
    page: number;
    submissions: UserPendingSubmission[];
}

export default async function GetUserPendingSubmissions(userID: number) {
    const res = await APIClient.get<GetUserPendingSubmissionsResponse>(`/user/${userID}/submissions`, { params: { pending: true } });
    return res.data;
}
