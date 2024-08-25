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

export default async function GetLevelSubmissions({ levelID, page = 1, chunk = 25, username }: { levelID: number, page?: number, chunk?: number, username?: string }) {
    const res = await APIClient.get<GetLevelSubmissionsResponse>(`/level/${levelID}/submissions`, { params: { page, chunk, username: username || undefined } });
    return res.data;
}