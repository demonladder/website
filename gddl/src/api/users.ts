import axios from "axios";
import serverIP from "../serverIP";
import { Submission } from "./submissions";
import { StorageManager } from "../storageManager";

type UserSubmissions = {
    previousPage: number,
    nextPage: number,
    pages: number,
    submissions: Submission[],
}

type User = {
    ID: number,
    Name: string,
    Hardest: number,
    Favorite: number,
    LeastFavorite: number,
    MinPref: number,
    MaxPref: number,
    Introduction: string,
    AverageEnjoyment: number,
}

async function GetUser(userID: number): Promise<User> {
    const res = await axios.get(`${serverIP}/user?userID=${userID}&all=true`);
    return res.data;
}

async function GetUserSubmissions(userID: number, page = 1): Promise<UserSubmissions> {
    return (await axios.get(`${serverIP}/user/submissions?userID=${userID}&page=${page}`)).data;
}

async function SaveProfile(user: User) {
    const res = await axios.put(`${serverIP}/user?userID=${user.ID}`, { user }, {
        withCredentials: true,
        headers: StorageManager.authHeader(),
    });
    return res.data;
}

export {
    GetUser,
    GetUserSubmissions,
    SaveProfile
}