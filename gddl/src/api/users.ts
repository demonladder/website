import { Submission } from "./submissions";
import instance from "./axios";
import StorageManager from "../utils/storageManager";

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
    MinPref: number | null,
    MaxPref: number | null,
    Introduction: string | null,
    AverageEnjoyment: number | null,
    PermissionLevel: number,
    Avatar: string,
    DiscordID: string,
}

export interface EdittableUser {
    ID: number,
    Introduction?: string,
    Favorite?: number,
    LeastFavorite?: number,
    MinPref?: number,
    MaxPref?: number,
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

async function GetUser(userID: number): Promise<User> {
    const res = await instance.get(`/user?userID=${userID}`);
    return res.data;
}

async function SearchUser(name: string): Promise<TinyUser[]> {
    const res = await instance.get(`/user/search`, { params: { name, chunk: 5, } });
    return res.data;
}

async function GetUserSubmissions({userID, page = 1, sort, sortDirection}: { userID: number, page?: number, sort: string, sortDirection: string}): Promise<UserSubmissions> {
    return (await instance.get(`/user/submissions`, { params: { userID, page, sort, sortDirection, chunk: 16 }})).data;
}

async function SaveProfile(user: EdittableUser) {
    const csrfToken = StorageManager.getCSRF();
    const res = await instance.put(`/user?userID=${user.ID}`, { user }, {
        withCredentials: true,
        params: { csrfToken },
    });
    return res.data;
}

async function PromoteUser(userID: number, permissionLevel: number) {
    const csrfToken = StorageManager.getCSRF();
    await instance.put('/user/promote', { userID, permissionLevel }, { withCredentials: true, params: { csrfToken } });
}

export function Delete(id: number) {
    const csrfToken = StorageManager.getCSRF();
    return instance.delete('/user?id=' + id, { withCredentials: true, params: { csrfToken }});
}

export interface StaffMember {
    ID: number,
    Name: string,
    PermissionLevel: number,
}

export function GetStaff(): Promise<StaffMember[]> {
    return instance.get('/user/staff').then(res => res.data);
}

export function GetDiscordUser(userID: number): Promise<DiscordUser> {
    return instance.get('/user/discord', { params: { userID } }).then(res => res.data);
}

export {
    GetUser,
    SearchUser,
    GetUserSubmissions,
    SaveProfile,
    PromoteUser,
}