import axios from "axios";
import serverIP from "../serverIP";

export async function GetLevels({ name, exact}) {
    const res = await axios.get(`${serverIP}/searchLevels?chunk=5&name=${name}&exactName=${exact}`);
    return res.data.levels;
}

export async function SearchLevels(q) {
    const res = await axios.get(`${serverIP}/searchLevels`, {
        withCredentials: 'include',
        params: q
    });
    return res.data;
}

export async function GetLevel({ queryKey }) {
    const [_, id] = queryKey;
    const res = await axios.get(`${serverIP}/getLevel?levelID=${id}&returnPacks=true`);
    return res.data;
}