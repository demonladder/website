import APIClient from '../../../api/APIClient';
import Submission from '../../../api/types/Submission';
import { Difficulties, LevelLengths, Rarity } from '../../level/types/LevelMeta';

export type UserSubmission = {
    ID: number;
    Rating: Submission['Rating'];
    Enjoyment: Submission['Enjoyment'];
    Proof: Submission['Proof'];
    DateAdded: Submission['DateAdded'];
    Level: {
        ID: number;
        Rating: number | null;
        Enjoyment: number | null;
        Meta: {
            Name: string;
            Difficulty: Difficulties;
            Length: LevelLengths;
            Rarity: Rarity;
            IsTwoPlayer: boolean;
            Song: {
                Name: string;
            };
            Publisher?: {
                name: string;
            };
        };
    };
};

export interface GetUserSubmissionsResponses {
    total: number;
    limit: number;
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

export async function getUserSubmissions({
    userID,
    page = 0,
    name,
    sort,
    sortDirection,
    onlyIncomplete,
}: {
    userID: number;
    page?: number;
    name?: string;
    sort: Sorts;
    sortDirection: string;
    onlyIncomplete?: boolean;
}) {
    const res = await APIClient.get<GetUserSubmissionsResponses>(`/user/${userID}/submissions`, {
        params: {
            page,
            name,
            sort,
            sortDirection,
            limit: 16,
            onlyIncomplete: onlyIncomplete === true,
        },
    });

    return res.data;
}
