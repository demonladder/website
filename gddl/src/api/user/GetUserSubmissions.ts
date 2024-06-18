import APIClient from '../APIClient';
import Level from '../types/Level';
import Meta from '../types/Meta';
import Song from '../types/Song';
import Submission from '../types/Submission';

export type UserSubmission = Submission & { Level: Level & { Meta: Meta & { Song: Song } } };

type GetUserSubmissionsResponses = {
    total: number;
    limit: number;
    page: number;
    submissions: UserSubmission[];
}

export default GetUserSubmissionsResponses;

export async function GetUserSubmissions({ userID, page = 1, name, sort, sortDirection }: { userID: number; page?: number; name?: string; sort: string; sortDirection: string; }): Promise<GetUserSubmissionsResponses> {
    return (await APIClient.get(`/user/${userID}/submissions`, { params: { page, name, sort, sortDirection, chunk: 16 } })).data;
}