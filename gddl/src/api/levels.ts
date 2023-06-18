import axios from "axios";
import serverIP from "../serverIP";
import { Pack } from "./packs";
import { Submission } from "./submissions";

export type Level = {
    ID: number,
    Name: string,
    Rating: number,
    Enjoyment: number,
    Deviation: number,
    RatingCount: number,
    EnjoymentCount: number,
    SubmissionCount: number,
    Difficulty: number,
    Song: string,
    Creator: string,
}

type LevelInfo = {
    info: Level,
    submissions: Submission[],
    packs?: Pack[]
}

type SearchInfo = {
    count: number,
    levels: Level[],
}

type Query = {

}

export async function SearchLevels(q: Query): Promise<SearchInfo> {
    return (await axios.get(`${serverIP}/level/search`, {
        withCredentials: true,
        params: q
    })).data;
}

export async function GetLevel(id: number | null) {
    if (id === null) return null;

    return (await axios.get(`${serverIP}/level?levelID=${id}&returnPacks=true`)).data;
}

export function GetLevelPacks(levelID: number): Promise<{ ID: number, Name: string }[]> {
    return axios.get(`${serverIP}/level/packs?levelID=${levelID}`).then(res => res.data);
}