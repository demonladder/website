import axios from "axios";
import serverIP from "../serverIP";

export function GetUser(id) {
    return axios.get(`${serverIP}/getUser?userID=${id}&all=true`).then(res => res.data);
}