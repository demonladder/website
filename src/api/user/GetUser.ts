import APIClient from '../APIClient';
import DiscordUserData from '../types/DiscordUserData';
import Level from '../types/Level';
import LevelMeta from '../types/LevelMeta';
import Role from '../types/Role';
import Song from '../types/Song';
import User from '../types/User';

type DTOResponse = User & {
    Hardest?: Level & { Meta: LevelMeta & { Song: Song } },
    DiscordData: DiscordUserData | null,
    CompletedPacks: { PackID: number, IconName: string }[],
    PendingSubmissionCount: number,
    TotalSubmissions: number,
    Roles: Role[],
};

export type UserResponse = Omit<DTOResponse, 'Favorite' | 'LeastFavorite'> & {
    FavoriteLevels: number[],
    LeastFavoriteLevels: number[],
}

export default async function GetUser(userID: number): Promise<UserResponse> {
    const res = (await APIClient.get<DTOResponse>(`/user/${userID}`)).data;

    const user: UserResponse = {
        ...res,
        FavoriteLevels: res.Favorite?.toString().split(',').map((v: string) => parseInt(v)).slice(0, 2) || [],
        LeastFavoriteLevels: res.LeastFavorite?.toString().split(',').map((v: string) => parseInt(v)).slice(0, 2) || [],
    };

    return user;
}