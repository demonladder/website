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

async function GetUser(userID: number): Promise<User> {
    const res = await instance.get(`/user?userID=${userID}&all=true`);
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

export {
    GetUser,
    GetUserSubmissions,
    SaveProfile,
}