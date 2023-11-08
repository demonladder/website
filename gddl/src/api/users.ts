import { Submission } from "./submissions";
import APIClient from "./axios";
import StorageManager from "../utils/StorageManager";

type UserSubmissions = {
    total: number,
    limit: number,
    page: number,
    submissions: Submission[],
}

export type User = {
    ID: number,
    Name: string,
    Hardest: number | null,
    Favorite: number | null,
    LeastFavorite: number | null,
    FavoriteLevels: number[],
    LeastFavoriteLevels: number[],
    MinPref: number | null,
    MaxPref: number | null,
    Introduction: string | null,
    AverageEnjoyment: number | null,
    PermissionLevel: number,
    Avatar: string,
    DiscordID: string,
}

export interface EdittableUser {
    Introduction?: string | null,
    FavoriteLevels?: string,
    LeastFavoriteLevels?: string,
    MinPref?: number | null,
    MaxPref?: number | null,
}

export type TinyUser = {
    ID: number,
    Name: string,
    PermissionLevel: number,
}

export interface DiscordUser {
    GDDLID: number
    ID: string
    Name: string
    Username: string
    Avatar: string
    AccentColor: number
}

export async function GetUser(userID: number): Promise<User> {
    const res = (await APIClient.get(`/user?userID=${userID}`)).data as User;

    const user: User = {
        ...res,
        FavoriteLevels: res.Favorite?.toString().split(',').map((v: string) => parseInt(v)).slice(0, 2) || [],
        LeastFavoriteLevels: res.LeastFavorite?.toString().split(',').map((v: string) => parseInt(v)).slice(0, 2) || [],
    };

    return user;
}

export async function SearchUser(name: string): Promise<TinyUser[]> {
    const res = await APIClient.get(`/user/search`, { params: { name, chunk: 5, } });
    return res.data;
}

export async function GetUserSubmissions({userID, page = 1, name, sort, sortDirection}: { userID: number, page?: number, name?: string, sort: string, sortDirection: string}): Promise<UserSubmissions> {
    return (await APIClient.get(`/user/submissions`, { params: { userID, page, name, sort, sortDirection, chunk: 16 }})).data;
}

export async function SaveProfile(user: EdittableUser) {
    const csrfToken = StorageManager.getCSRF();
    
    return (await APIClient.put('/user', user, {
        withCredentials: true,
        params: { csrfToken },
    })).data;
}

export async function PromoteUser(userID: number, permissionLevel: number) {
    const csrfToken = StorageManager.getCSRF();
    await APIClient.put('/user/promote', { userID, permissionLevel }, { withCredentials: true, params: { csrfToken } });
}

export function Delete(id: number) {
    const csrfToken = StorageManager.getCSRF();
    return APIClient.delete('/user?id=' + id, { withCredentials: true, params: { csrfToken }});
}

export interface StaffMember {
    ID: number,
    Name: string,
    PermissionLevel: number,
}

export function GetStaff(): Promise<StaffMember[]> {
    return APIClient.get('/user/staff').then(res => res.data);
}

export function GetDiscordUser(userID: number): Promise<DiscordUser> {
    return APIClient.get('/user/discord', { params: { userID } }).then(res => res.data);
}