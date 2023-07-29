import { Submission } from "./submissions";
import instance from "./axios";
import { StorageManager } from "../storageManager";

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
}

export type TinyUser = {
    ID: number,
    Name: string,
    PermissionLevel: number,
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

async function SaveProfile(user: User) {
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

export {
    GetUser,
    SearchUser,
    GetUserSubmissions,
    SaveProfile,
    PromoteUser,
}