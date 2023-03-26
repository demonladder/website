import axios from "axios";
import serverIP from "../serverIP";

export async function GetLevels(name) {
    const res = await axios.get(`${serverIP}/getLevels?chunk=5&name=${name}&exactName=true`);
    return res.data.levels;
}

export async function SearchLevels(name, exact = true) {
    const res = await axios.get(`${serverIP}/getLevels?chunk=5&name=${name}&exactName=${exact}`);
    return res.data.levels;
}

export async function GetLevel({ queryKey }) {
    const [_, id] = queryKey;
    const res = await axios.get(`${serverIP}/getLevel?levelID=${id}&returnPacks=true`);
    return res.data;
}