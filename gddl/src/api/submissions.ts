import APIClient from './APIClient';

export type Submission = {
    LevelID: number,
    UserID: number,
    Rating: number | null,
    Enjoyment: number | null,
    RefreshRate: number,
    Device: string,
    Name: string,
    Creator: string,
    Song: string,
    Proof: string,
    Difficulty: string,
    DateAdded: string;  // In UTC
    DateChanged: string;  // In UTC
}

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
}

type SubmissionInfo = {
    total: number,
    limit: number,
    page: number,
    submissions: Submission[],
}

interface PendingSubmissionInfo {
    total: number,
    submissions: SubmissionQueueInfo[],
}

export async function GetSubmissionQueue(proofFilter: string): Promise<PendingSubmissionInfo> {
    const res = await APIClient.get('/submissions/pending', { params: { proofFilter }});
    return res.data;
}

export async function GetSubmissions({ levelID, page = 1, chunk = 25 }: { levelID: number, page?: number, chunk?: number }): Promise<SubmissionInfo> {
    const res = await APIClient.get('/submissions', { params: { levelID, page, chunk } });
    return res.data;
}

export function DeleteSubmission(levelID: number, userID: number) {
    return APIClient.delete('/submissions', { data: { levelID, userID } });
}

export function ApproveSubmission(info: { deny: boolean, reason?: string, onlyEnjoyment?: boolean } & Submission): Promise<void> {
    return APIClient.put('/submissions/approve', { levelID: info.LevelID, userID: info.UserID, deny: info.deny, onlyEnjoyment: info.onlyEnjoyment, reason: info.reason });
}

export async function SendSubmission(submission: SubmittableSubmission) {
    const res = await APIClient.post('/submit', { ...submission });
    return res.data;
}