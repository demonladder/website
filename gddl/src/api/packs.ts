import axios from "axios";
import serverIP from "../serverIP";
import { Level } from "./levels";

export type Pack = {
    ID: number,
    Name: string,
    Levels: Level[]
}

export async function GetPacks(): Promise<Pack[]> {
    const res = await axios.get(`${serverIP}/packs?chunk=300`);
    return res.data;
}

export async function GetPack(packID: number): Promise<Pack> {
    const res = await axios.get(`${serverIP}/pack?packID=${packID}`);
    return res.data;
}

export async function SearchPacks(name: string): Promise<Pack[]> {
    const res = await axios.get(`${serverIP}/packs?name=${name}`);
    return res.data;
}