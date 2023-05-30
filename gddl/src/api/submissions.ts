import axios from 'axios';
import serverIP from '../serverIP';

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

const user = JSON.parse(''+localStorage.getItem('user'));
const csrfToken = user ? user.csrfToken : null;

export async function GetSubmissionQueue(): Promise<SubmissionQueueInfo[]> {
    const res = await axios.get(`${serverIP}/submissions/pending`, { withCredentials: true, params: { csrfToken } });
    return res.data;
}

export function ApproveSubmission(info: {deny: boolean} & Submission): Promise<void> {
    return axios.get(`${serverIP}/approveSubmission`, { withCredentials: true, params: { levelID: info.LevelID, userID: info.UserID, deny: info.deny, csrfToken }});
}

export async function SendSubmission(submission: SubmittableSubmission) {
    const res = await axios.post(`${serverIP}/submit`, { csrfToken, submission }, { withCredentials: true });
    return res.data;
}