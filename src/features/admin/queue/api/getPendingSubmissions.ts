import APIClient from '../../../../api/APIClient';
import Level from '../../../level/types/Level';
import LevelMeta from '../../../level/types/LevelMeta';
import PendingSubmission from '../../../../api/types/PendingSubmission';
import User from '../../../../api/types/User';
import { Publisher } from '../../../../api/types/Publisher';

export type QueueSubmission = Pick<
    PendingSubmission,
    | 'ID'
    | 'UserID'
    | 'LevelID'
    | 'Rating'
    | 'Enjoyment'
    | 'Device'
    | 'RefreshRate'
    | 'Proof'
    | 'Progress'
    | 'Attempts'
    | 'IsSolo'
    | 'SecondPlayerID'
    | 'DateChanged'
> & {
    Level: Pick<Level, 'Rating' | 'TwoPlayerRating' | 'Deviation' | 'TwoPlayerDeviation' | 'RatingCount'> & {
        Meta: Pick<LevelMeta, 'Name' | 'Difficulty' | 'Length' | 'IsTwoPlayer'> & {
            Publisher: Pick<Publisher, 'name'> | null;
        };
    };
    User: Pick<User, 'Name'>;
};

interface PendingSubmissionInfo {
    total: number;
    submissions: QueueSubmission[];
}

interface GetPendingSubmissionsOptions {
    limit?: number;
    page?: number;
    proofFilter?: string;
    levelID?: number;
}

export async function getPendingSubmissions({
    levelID,
    proofFilter,
    limit = 5,
    page = 0,
}: GetPendingSubmissionsOptions): Promise<PendingSubmissionInfo> {
    const res = await APIClient.get<PendingSubmissionInfo>('/submissions/pending', {
        params: { limit, page, levelID, proofFilter },
    });
    return res.data;
}
