import APIClient from '../APIClient';
import ISubmission from '../types/Submission';
import User from '../types/User';

export type Submission = (ISubmission & { User: User });

type GetLevelSubmissionsResponse = {
    total: number,
    limit: number,
    page: number,
    submissions: Submission[],
}

type GetLevelSubmissionsRequest = {
    twoPlayer?: boolean,
    levelID: number,
    page?: number,
    progressFilter?: string,
    chunk?: number,
    username?: string,
}

export default async function GetLevelSubmissions({ twoPlayer, levelID, page = 1, progressFilter = 'victors', chunk = 25, username }: GetLevelSubmissionsRequest) {
    const res = await APIClient.get<GetLevelSubmissionsResponse>(`/level/${levelID}/submissions`, { params: {
        page,
        chunk,
        twoPlayer,
        username: username || undefined,
        progressFilter,
    } });
    return res.data;
}