import StorageManager from '../utils/StorageManager';
import APIClient from './axios';

export type Submission = {
    LevelID: number,
    UserID: number,
    Rating: number,
    Enjoyment: number,
    RefreshRate: number,
    Device: string,
    Name: string,
    Creator: string,
    Song: string,
    Proof: string,
    Difficulty: string,
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
    limit: number,
    page: number,
    submissions: SubmissionQueueInfo[],
}

export async function GetSubmissionQueue(): Promise<PendingSubmissionInfo> {
    const csrfToken = StorageManager.getCSRF();
    const res = await APIClient.get('/submissions/pending', { withCredentials: true, params: { csrfToken } });
    return res.data;
}

export async function GetSubmissions({ levelID, page = 1, chunk = 25 }: { levelID: number, page?: number, chunk?: number }): Promise<SubmissionInfo> {
    const res = await APIClient.get('/submissions', { params: { levelID, page, chunk } });
    return res.data;
}

export function DeleteSubmission(levelID: number, userID: number) {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.delete('/submissions', { withCredentials: true, params: { csrfToken }, data: { levelID, userID } });
}

export function ApproveSubmission(info: { deny: boolean, onlyEnjoyment?: boolean } & Submission): Promise<void> {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.put('/submissions/approve', { levelID: info.LevelID, userID: info.UserID, deny: info.deny, onlyEnjoyment: info.onlyEnjoyment }, { withCredentials: true, params: { csrfToken } });
}

export async function SendSubmission(submission: SubmittableSubmission) {
    const csrfToken = StorageManager.getCSRF();
    const res = await APIClient.post('/submit', { ...submission }, { withCredentials: true, params: { csrfToken } });
    return res.data;
}