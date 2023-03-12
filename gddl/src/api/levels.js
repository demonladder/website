import axios from "axios";
import serverIP from "../serverIP";

export function GetLevels(name) {
    return axios.get(`${serverIP}/getLevels?chunk=5&name=${name}&exactName=true`).then(res => res.data.levels);
}