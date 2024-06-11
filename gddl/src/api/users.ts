import { Submission } from './submissions';
import APIClient from './APIClient';
import { FullLevel } from './levels';

type UserSubmissions = {
    total: number,
    limit: number,
    page: number,
    submissions: (Submission & { ActualRating?: number, ActualEnjoyment?: number})[],
}

export type User = {
    ID: number,
    Name: string,
    HardestID: number | null,
    Favorite: number | null,
    LeastFavorite: number | null,
    MinPref: number | null,
    MaxPref: number | null,
    Introduction: string | null,
    AverageEnjoyment: number | null,
    RoleIDs: number,
    TotalSubmissions: number,
    FavoriteLevels: number[],
    LeastFavoriteLevels: number[],
    PendingSubmissionCount: number,
    CompletedPacks: (
        {
            PackID: number,
            IconName: string,
        }
    )[];
}

export interface EdittableUser {
    introduction?: string | null,
    favoriteLevels?: string,
    leastFavoriteLevels?: string,
    minPref?: number | null,
    maxPref?: number | null,
}

export type TinyUser = {
    ID: number,
    Name: string,
    PermissionLevel: number,
}

export interface DiscordUser {
    GDDLID: number;
    ID: string;
    Name: string | null;
    Username: string;
    Avatar: string | null;
    AccentColor: number | null;
}

export async function GetUser(userID: number): Promise<User & { Hardest: FullLevel, DiscordData?: DiscordUser }> {
    const res = (await APIClient.get(`/user/${userID}`)).data as User & { Hardest: FullLevel, DiscordData?: DiscordUser };

    const user: User & { Hardest: FullLevel, DiscordData?: DiscordUser } = {
        ...res,
        FavoriteLevels: res.Favorite?.toString().split(',').map((v: string) => parseInt(v)).slice(0, 2) || [],
        LeastFavoriteLevels: res.LeastFavorite?.toString().split(',').map((v: string) => parseInt(v)).slice(0, 2) || [],
    };

    return user;
}

export async function SearchUser(name: string, chunk = 5): Promise<TinyUser[]> {
    const res = await APIClient.get(`/user/search`, { params: { name, chunk } });
    return res.data;
}

export async function GetUserSubmissions({userID, page = 1, name, sort, sortDirection}: { userID: number, page?: number, name?: string, sort: string, sortDirection: string}): Promise<UserSubmissions> {
    return (await APIClient.get(`/user/submissions`, { params: { userID, page, name, sort, sortDirection, chunk: 16 }})).data;
}

export async function SaveProfile(userID: number, user: EdittableUser) {
    return (await APIClient.put(`/user/${userID}`, user)).data;
}

export async function PromoteUser(userID: number, permissionLevel: number) {
    await APIClient.put('/user/promote', { userID, permissionLevel });
}

export function Delete(id: number) {
    return APIClient.delete('/user?id=' + id);
}

export interface StaffMember {
    ID: number,
    Name: string,
    PermissionLevel: number,
}

export function GetStaff(): Promise<StaffMember[]> {
    return APIClient.get('/user/staff').then(res => [
        ...res.data,
        {
            ID: 1406,
            Name: 'Diversion',
            PermissionLevel: 4,
        },
    ]);
}

export function GetDiscordUser(userID: number): Promise<DiscordUser> {
    return APIClient.get('/user/discord', { params: { userID } }).then(res => res.data);
}