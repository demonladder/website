import axios from "axios";
import serverIP from "../serverIP";

export function GetLevels(name) {
    return axios.get(`${serverIP}/getLevels?chunk=5&name=${name}&exactName=true`).then(res => res.data.levels);
}

export function SearchLevels(name) {
    return axios.get(`${serverIP}/getLevels?chunk=5&name=${name}&exactName=true`).then(res => res.data.levels);
}

export function GetLevel(id) {
    return axios.get(`${serverIP}/getLevel?levelID=${id}&returnPacks=true`).then(res => res.data);
}