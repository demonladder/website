import { Submission } from "./submissions";
import instance from "./axios";

type UserSubmissions = {
    previousPage: number,
    nextPage: number,
    pages: number,
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
    const res = await instance.get(`/user?userID=${userID}&all=true`);
    return res.data;
}

async function SearchUser(name: string): Promise<TinyUser[]> {
    const res = await instance.get(`/user/search`, { params: { name, chunk: 5, } });
    return res.data;
}

async function GetUserSubmissions(userID: number, page = 1): Promise<UserSubmissions> {
    return (await instance.get(`/user/submissions?userID=${userID}&page=${page}`)).data;
}

async function SaveProfile(user: User) {
    const res = await instance.put(`/user?userID=${user.ID}`, { user }, {
        withCredentials: true,
    });
    return res.data;
}

async function PromoteUser(userID: number, permissionLevel: number) {
    await instance.put('/user/promote', { userID, permissionLevel }, { withCredentials: true });
}

export {
    GetUser,
    SearchUser,
    GetUserSubmissions,
    SaveProfile,
    PromoteUser,
}