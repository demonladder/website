import axios from 'axios';
import serverIP from '../serverIP';
import { StorageManager } from '../storageManager';

export type Submission = {
    LevelID: number,
    UserID: number,
    Rating: number,
    Enjoyment: number,
    RefreshRate: number,
    Device: string,
    Name: string,
    Creator: string,
    Proof: string,
}

export type SubmissionQueueInfo = Submission & {
    ActualRating: number,
    UserName: string,
}

export type SubmittableSubmission = {
    levelID: number,
    rating?: number,
    enjoyment?: number,
    refreshRate?: number,
    device?: number,
    proof?: string,
}

export async function GetSubmissionQueue(): Promise<SubmissionQueueInfo[]> {
    const res = await axios.get(`${serverIP}/submissions/pending`, { withCredentials: true, headers: StorageManager.authHeader() });
    return res.data;
}

export function ApproveSubmission(info: {deny: boolean} & Submission): Promise<void> {
    return axios.put(`${serverIP}/submissions/approve`, { levelID: info.LevelID, userID: info.UserID, deny: info.deny }, { withCredentials: true, headers: StorageManager.authHeader() });
}

export async function SendSubmission(submission: SubmittableSubmission) {
    const res = await axios.post(`${serverIP}/submit`, { submission }, { withCredentials: true, headers: StorageManager.authHeader() });
    return res.data;
}