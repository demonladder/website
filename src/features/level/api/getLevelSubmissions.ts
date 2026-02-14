import APIClient from '../../../api/APIClient';
import ISubmission from '../../../api/types/Submission';
import type User from '../../../api/types/User';

export type Submission = Pick<
    ISubmission,
    | 'ID'
    | 'Rating'
    | 'Enjoyment'
    | 'RefreshRate'
    | 'Device'
    | 'Proof'
    | 'IsSolo'
    | 'Progress'
    | 'Attempts'
    | 'DateAdded'
    | 'weight'
> & {
    User: Pick<User, 'ID' | 'Name' | 'avatar'> & {
        roles: number[];
    };
    SecondaryUser: Pick<User, 'ID' | 'Name' | 'avatar'> | null;
};

interface GetLevelSubmissionsResponse {
    total: number;
    limit: number;
    page: number;
    data: Submission[];
}

export enum SubmissionSort {
    ATTEMPTS = 'attempts',
    DATE_ADDED = 'dateAdded',
    ENJOYMENT = 'enjoyment',
    RATING = 'rating',
    PROGRESS = 'progress',
    REFRESH_RATE = 'refreshRate',
    USERNAME = 'username',
}

interface GetLevelSubmissionsRequest {
    twoPlayer?: boolean;
    levelID: number;
    page?: number;
    progressFilter?: string;
    limit?: number;
    username?: string;
    sort?: SubmissionSort;
    sortDirection?: 'asc' | 'desc';
}

export async function getLevelSubmissions({
    twoPlayer,
    levelID,
    page = 1,
    progressFilter = 'victors',
    limit,
    sort,
    sortDirection,
    username,
}: GetLevelSubmissionsRequest) {
    const res = await APIClient.get<GetLevelSubmissionsResponse>(`/levels/${levelID}/submissions`, {
        params: {
            page,
            limit,
            twoPlayer,
            username: username || undefined,
            progressFilter,
            sort,
            sortDirection,
        },
    });
    return res.data;
}
