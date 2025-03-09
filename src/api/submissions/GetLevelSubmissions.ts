import APIClient from '../APIClient';
import ISubmission from '../types/Submission';
import User from '../types/User';

export type Submission = (ISubmission & {
    User: User,
    SecondaryUser?: User,
});

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
    limit?: number,
    username?: string,
}

export default async function GetLevelSubmissions({ twoPlayer, levelID, page = 1, progressFilter = 'victors', limit, username }: GetLevelSubmissionsRequest) {
    const res = await APIClient.get<GetLevelSubmissionsResponse>(`/level/${levelID}/submissions`, { params: {
        page,
        limit,
        twoPlayer,
        username: username || undefined,
        progressFilter,
    } });
    return res.data;
}
