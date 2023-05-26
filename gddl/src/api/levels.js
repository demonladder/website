import axios from "axios";
import serverIP from "../serverIP";

export async function GetLevels({ name, exact}) {
    const res = await axios.get(`${serverIP}/level/search?chunk=5&name=${name}&exactName=${exact}`);
    return res.data.levels;
}

export async function SearchLevels(q) {
    return (await axios.get(`${serverIP}/level/search`, {
        withCredentials: 'include',
        params: q
    })).data;
}

export async function GetLevel(id) {
    return (await axios.get(`${serverIP}/level?levelID=${id}&returnPacks=true`)).data;
}