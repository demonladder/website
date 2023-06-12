import axios from "axios";
import serverIP from "../serverIP";
import { Level } from "./levels";

export type Pack = {
    ID: number,
    Name: string,
    Levels: Level[],
}

export type PackShell = {
    ID: number,
    Name: string,
}

export type PackInfo = {
    previousPage: number,
    nextPage: number,
    pages: number,
    packs: PackShell[],
}

export async function GetPacks(page: number): Promise<PackInfo> {
    const res = await axios.get(`${serverIP}/packs?chunk=48&page=${page}`);
    return res.data;
}

export async function GetPack(packID: number): Promise<Pack> {
    const res = await axios.get(`${serverIP}/pack?packID=${packID}`);
    return {...res.data, ID: packID};
}

export async function SearchPacks(name: string): Promise<PackInfo> {
    const res = await axios.get(`${serverIP}/packs?name=${name}&chunk=5`);
    return res.data;
}