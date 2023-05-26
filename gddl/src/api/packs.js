import axios from "axios";
import serverIP from "../serverIP";

export function GetPacks() {
    return axios.get(`${serverIP}/packs?chunk=300`).then(res => res.data);
}

export function GetPack(packID) {
    return axios.get(`${serverIP}/pack?packID=${packID}`).then(res => res.data);
}

export function SearchPacks(name) {
    return axios.get(`${serverIP}/packs?name=${name}`).then(res => res.data);
}