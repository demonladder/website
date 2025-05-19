import APIClient from '../../../api/APIClient';
import Level from '../../../api/types/Level';
import LevelMeta from '../../../api/types/LevelMeta';
import Song from '../../../api/types/Song';
import Submission from '../../../api/types/Submission';

export type UserSubmission = Submission & {
    Level: Level & {
        Meta: LevelMeta & {
            Song: Song,
        },
    },
};

export interface GetUserSubmissionsResponses {
    total: number;
    limit: number,
    page: number;
    submissions: UserSubmission[];
}

export enum Sorts {
    LEVEL_ID = 'levelID',
    RATING = 'rating',
    LEVEL_RATING = 'levelRating',
    NAME = 'name',
    ENJOYMENT = 'enjoyment',
    LEVEL_ENJOYMENT = 'levelEnjoyment',
    RECENCY = 'recency',
}

export async function getUserSubmissions({ userID, page = 0, name, sort, sortDirection, onlyIncomplete }: { userID: number, page?: number, name?: string, sort: Sorts, sortDirection: string, onlyIncomplete?: boolean }) {
    const res = await APIClient.get<GetUserSubmissionsResponses>(`/user/${userID}/submissions`, {
        params: {
            page,
            name,
            sort,
            sortDirection,
            limit: 16,
            onlyIncomplete: onlyIncomplete === true,
        }
    });

    return res.data;
}
