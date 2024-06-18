import APIClient from '../APIClient';
import Level from '../types/Level';
import Meta from '../types/Meta';
import Song from '../types/Song';
import Submission from '../types/Submission';

export type UserPendingSubmission = Submission & { Level: Level & { Meta: Meta & { Song: Song; }; }; };
type GetUserPendingSubmissionsResponse = UserPendingSubmission[];

export async function GetUserPendingSubmissions(userID: number): Promise<GetUserPendingSubmissionsResponse> {
    const res = await APIClient.get(`/user/${userID}/submissions/pending`, { params: { userID } });
    return res.data;
}