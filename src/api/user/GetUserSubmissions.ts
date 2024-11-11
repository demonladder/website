import APIClient from '../APIClient';
import Level from '../types/Level';
import LevelMeta from '../types/LevelMeta';
import Song from '../types/Song';
import Submission from '../types/Submission';

export type UserSubmission = Submission & { Level: Level & { Meta: LevelMeta & { Song: Song } } };

export type GetUserSubmissionsResponses = {
    total: number;
    limit: number;
    page: number;
    submissions: UserSubmission[];
}

export default async function GetUserSubmissions({ userID, page = 1, name, sort, sortDirection, onlyIncomplete }: { userID: number, page?: number, name?: string, sort: string, sortDirection: string, onlyIncomplete?: boolean }) {
    return (await APIClient.get<GetUserSubmissionsResponses>(`/user/${userID}/submissions`, { params: { page, name, sort, sortDirection, chunk: 16, onlyIncomplete: onlyIncomplete === true } })).data;
}