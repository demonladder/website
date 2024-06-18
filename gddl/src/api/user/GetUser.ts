import APIClient from '../APIClient';
import DiscordUserData from '../types/DiscordUserData';
import Level from '../types/Level';
import Meta from '../types/Meta';
import Role from '../types/Role';
import Song from '../types/Song';
import User from '../types/User';

type DTOResponse = User & {
    Hardest: Level & { Meta: Meta & { Song: Song } },
    DiscordData: DiscordUserData | null,
    CompletedPacks: { PackID: number, IconName: string }[],
    PendingSubmissionCount: number,
    TotalSubmissions: number,
    Roles: Role[],
};

type UserResponse = Omit<DTOResponse, 'Favorite' | 'LeastFavorite'> & {
    FavoriteLevels: number[],
    LeastFavoriteLevels: number[],
}

export async function GetUser(userID: number): Promise<UserResponse> {
    const res = (await APIClient.get(`/user/${userID}`)).data as DTOResponse;

    const user: UserResponse = {
        ...res,
        FavoriteLevels: res.Favorite?.toString().split(',').map((v: string) => parseInt(v)).slice(0, 2) || [],
        LeastFavoriteLevels: res.LeastFavorite?.toString().split(',').map((v: string) => parseInt(v)).slice(0, 2) || [],
    };

    return user;
}