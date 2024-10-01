import APIClient from '../APIClient';
import Level from '../types/Level';
import LevelMeta from '../types/LevelMeta';
import Submission from '../types/Submission';
import User from '../types/User';

export type QueueSubmission = Submission & { Level: Level & { Meta: LevelMeta; }; User: User; };

interface PendingSubmissionInfo {
    total: number;
    submissions: QueueSubmission[];
}

export default async function GetSubmissionQueue(proofFilter: string, limit = 5, page = 1): Promise<PendingSubmissionInfo> {
    const res = await APIClient.get('/submissions/pending', { params: { limit, page, proofFilter } });
    return res.data;
}