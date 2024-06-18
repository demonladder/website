import APIClient from './APIClient';
import GetLevelSubmissionsResponse from './submissions/responses/GetLevelSubmissionsResponse';
import Submission from './types/Submission';

export type SubmissionQueueInfo = Submission & {
    ActualRating: number,
    UserName: string,
    DateAdded: string,
}

export type SubmittableSubmission = {
    levelID: number,
    rating?: number,
    enjoyment?: number,
    refreshRate?: number,
    device?: number,
    proof?: string,
    isSolo?: boolean,
    secondPlayerID?: number,
}



interface PendingSubmissionInfo {
    total: number,
    submissions: SubmissionQueueInfo[],
}

export async function GetSubmissionQueue(proofFilter: string): Promise<PendingSubmissionInfo> {
    const res = await APIClient.get('/submissions/pending', { params: { proofFilter } });
    return res.data;
}

export async function GetLevelSubmissions({ levelID, page = 1, chunk = 25 }: { levelID: number, page?: number, chunk?: number }): Promise<GetLevelSubmissionsResponse> {
    const res = await APIClient.get(`/v2/level/${levelID}/submissions`, { params: { page, chunk } });
    return res.data;
}

export function DeleteSubmission(levelID: number, userID: number) {
    return APIClient.delete('/submissions', { data: { levelID, userID } });
}

export function DeletePendingSubmission(levelID: number, userID: number) {
    return APIClient.delete(`/user/${userID}/submissions/pending/${levelID}`);
}

export function ApproveSubmission(info: { onlyEnjoyment?: boolean } & Submission): Promise<void> {
    return APIClient.put('/v2/submissions/approve', { levelID: info.LevelID, userID: info.UserID, onlyEnjoyment: info.onlyEnjoyment });
}

export function DenySubmission(info: { reason?: string } & Submission): Promise<void> {
    return APIClient.delete('/v2/submissions/deny', { params: { levelID: info.LevelID, userID: info.UserID, reason: info.reason } });
}

export async function SendSubmission(submission: SubmittableSubmission) {
    const res = await APIClient.post('/submit', { ...submission });
    return res.data;
}