import APIClient from '../../../api/APIClient';
import ISubmission from '../../../api/types/Submission';

export type Submission = (Omit<ISubmission, 'UserID' | 'LevelID'> & {
    User: {
        ID: number;
        Name: string;
        Roles: { ID: number }[];
    },
    SecondaryUser?: {
        ID: number;
        Name: string;
        Roles: { ID: number }[];
    },
});

interface GetLevelSubmissionsResponse {
    total: number,
    limit: number,
    page: number,
    submissions: Submission[],
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

export async function getLevelSubmissions({ twoPlayer, levelID, page = 1, progressFilter = 'victors', limit, sort, sortDirection, username }: GetLevelSubmissionsRequest) {
    const res = await APIClient.get<GetLevelSubmissionsResponse>(`/level/${levelID}/submissions`, {
        params: {
            page,
            limit,
            twoPlayer,
            username: username || undefined,
            progressFilter,
            sort,
            sortDirection,
            properties: 'total,limit,page,submissions(ID,Rating,Enjoyment,RefreshRate,Device,Proof,IsSolo,SecondPlayerID,Progress,Attempts,DateAdded,User(ID,Name,Roles),SecondaryUser)',
        },
    });
    return res.data;
}
