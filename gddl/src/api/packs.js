import axios from "axios";
import serverIP from "../serverIP";

export function GetPacks() {
    return axios.get(`${serverIP}/getPacks?chunk=300`).then(res => res.data);
}

export function GetPack(id) {
    return axios.get(`${serverIP}/getPack?packID=${id}`).then(res => res.data);
}