import type { SubmissionStatus } from '../../features/profile/api/getUserPendingSubmissions';
import APIClient from '../APIClient';

class UserSubmissionsClient {
    async getStatusCounts(userID: number) {
        const res = await APIClient.get<Record<SubmissionStatus, number>>(`/user/${userID}/submissions/status-counts`);
        return res.data;
    }
}

export const userSubmissionsClient = new UserSubmissionsClient();
