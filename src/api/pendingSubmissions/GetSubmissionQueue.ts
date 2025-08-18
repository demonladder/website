import APIClient from '../APIClient';
import Level from '../../features/level/types/Level';
import LevelMeta from '../../features/level/types/LevelMeta';
import PendingSubmission from '../types/PendingSubmission';
import User from '../types/User';

export type QueueSubmission = PendingSubmission & {
    Level: Level & {
        Meta: LevelMeta & {
            Publisher: {
                name: string;
            };
        };
    };
    User: User;
};

interface PendingSubmissionInfo {
    total: number;
    submissions: QueueSubmission[];
}

export default async function GetSubmissionQueue(proofFilter: string, limit = 5, page = 0): Promise<PendingSubmissionInfo> {
    const res = await APIClient.get<PendingSubmissionInfo>('/submissions/pending', { params: { limit, page, proofFilter } });
    return res.data;
}
